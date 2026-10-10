import os
import uuid
from pathlib import Path
from typing import Any

import chromadb
import google.generativeai as genai
from docx import Document
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends
import jwt
from pydantic import BaseModel, Field
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()
ROOT = Path(__file__).resolve().parent.parent
DOCUMENTS_DIR = Path(os.getenv("DOCUMENTS_DIR", str(ROOT / "documents")))
DOCUMENTS_DIR = DOCUMENTS_DIR.resolve()
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError("JWT_SECRET phải được cấu hình và dài tối thiểu 32 ký tự")
client = chromadb.PersistentClient(path=os.getenv("CHROMA_DIR", str(ROOT / ".chroma")))
collection = client.get_or_create_collection("tbu-knowledge-base")
if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI(title="TBU One-Stop RAG Service", version="1.0.0")
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

class QueryRequest(BaseModel):
    question: str = Field(min_length=2, max_length=4000)
    top_k: int = Field(default=int(os.getenv("TOP_K", "4")), ge=1, le=10)

class IngestRequest(BaseModel):
    directory: str | None = None

bearer = HTTPBearer(auto_error=True)

def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> dict[str, Any]:
    try:
        return jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.InvalidTokenError as error:
        raise HTTPException(401, "Token không hợp lệ hoặc đã hết hạn") from error

def require_staff(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    if user.get("role") not in {"ADMIN", "STAFF", "Admin", "Cán bộ xử lý"}:
        raise HTTPException(403, "Chỉ cán bộ được phép thực hiện thao tác này")
    return user

def safe_document_directory(directory: str | None) -> Path:
    candidate = (DOCUMENTS_DIR / directory).resolve() if directory else DOCUMENTS_DIR
    if candidate != DOCUMENTS_DIR and DOCUMENTS_DIR not in candidate.parents:
        raise HTTPException(400, "Thư mục ingestion không hợp lệ")
    if not candidate.is_dir():
        raise HTTPException(404, "Không tìm thấy thư mục tài liệu")
    return candidate

def read_document(path: Path) -> list[tuple[str, int]]:
    if path.suffix.lower() == ".pdf":
        return [(page.extract_text() or "", index + 1) for index, page in enumerate(PdfReader(str(path)).pages)]
    if path.suffix.lower() == ".docx":
        text = "\n".join(p.text for p in Document(str(path)).paragraphs)
        return [(text, 1)]
    return []

def embed(text: str) -> list[float]:
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(503, "GEMINI_API_KEY chưa được cấu hình")
    result = genai.embed_content(model=os.getenv("EMBEDDING_MODEL", "models/text-embedding-004"), content=text, task_type="retrieval_document")
    return result["embedding"]

def ingest_directory(directory: Path) -> int:
    count = 0
    for path in directory.rglob("*"):
        if path.is_symlink() or not path.is_file():
            continue
        if path.suffix.lower() not in {".pdf", ".docx"}:
            continue
        for page_text, page in read_document(path):
            for chunk in splitter.split_text(page_text):
                collection.add(
                    ids=[str(uuid.uuid4())],
                    documents=[chunk],
                    embeddings=[embed(chunk)],
                    metadatas=[{"document": path.name, "page": page}],
                )
                count += 1
    return count

@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "documents": collection.count(), "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}

@app.post("/ingest")
def ingest(request: IngestRequest, _user: dict[str, Any] = Depends(require_staff)) -> dict[str, int]:
    directory = safe_document_directory(request.directory)
    return {"chunks": ingest_directory(directory)}

@app.post("/query")
def query(request: QueryRequest, _user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(503, "GEMINI_API_KEY chưa được cấu hình")
    result = collection.query(query_embeddings=[embed(request.question)], n_results=request.top_k, include=["documents", "metadatas"])
    documents = result.get("documents", [[]])[0]
    metadatas = result.get("metadatas", [[]])[0]
    context = "\n\n".join(f"[{meta['document']} - trang {meta['page']}]\n{text}" for text, meta in zip(documents, metadatas))
    prompt = f"""Bạn là Trợ lý AI của Bộ phận Một cửa - Trường Đại học Thái Bình.
Trả lời bằng tiếng Việt, rõ ràng và chỉ sử dụng thông tin trong CONTEXT. Nếu không đủ dữ liệu, hãy nói rõ.
CONTEXT:
{context}

CÂU HỎI: {request.question}"""
    answer = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.0-flash")).generate_content(prompt).text
    citations = [{"document": meta["document"], "page": meta["page"]} for meta in metadatas]
    return {"answer": answer, "citations": citations}
