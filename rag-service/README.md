# TBU RAG Service

Dịch vụ FastAPI độc lập để lập chỉ mục PDF/DOCX và trả lời câu hỏi với Gemini.

## Chạy local

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Đặt tài liệu quy chế vào `documents/`, sau đó gọi `POST /ingest`. Truy vấn dùng `POST /query` với JSON `{ "question": "...", "top_k": 4 }`. Kết quả gồm câu trả lời và citations có tên tài liệu, số trang.

Hai endpoint ingestion/query yêu cầu `Authorization: Bearer <JWT>` dùng cùng `JWT_SECRET` với backend. Chỉ role `ADMIN`/`STAFF` được ingestion; đường dẫn ingestion chỉ được nằm dưới thư mục `documents/`, không chấp nhận đường dẫn tuyệt đối tùy ý.
