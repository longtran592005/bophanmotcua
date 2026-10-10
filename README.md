# TBU One-Stop Service

Cổng dịch vụ hành chính Một cửa điện tử của Trường Đại học Thái Bình.

## Cấu trúc dự án

```text
.
├── src/                    # React + Vite frontend
├── backend/                # API mới: Express + TypeScript + Prisma
│   ├── database/           # PostgreSQL schema và seed
│   ├── prisma/             # Prisma schema
│   └── src/                # Controllers, routes, middleware
├── rag-service/            # FastAPI + Gemini + Chroma RAG service
└── server/                 # API legacy, chỉ dùng để tương thích tạm thời
```

## Chạy frontend

```powershell
npm install
npm run dev
```

Frontend chạy mặc định tại `http://localhost:5173`.

## Chạy backend mới

```powershell
cd backend
Copy-Item .env.example .env
npm install
npx prisma generate
npm run dev
```

Trước khi chạy production, bắt buộc thay `DATABASE_URL`, `JWT_SECRET` và `CORS_ORIGINS`.

## Khởi tạo PostgreSQL

```powershell
psql "$env:DATABASE_URL" -f backend/database/schema.sql
psql "$env:DATABASE_URL" -f backend/database/seed.sql
```

Hoặc dùng Prisma migration theo hướng dẫn trong [backend/README.md](./backend/README.md).

## Chạy RAG service

Xem [rag-service/README.md](./rag-service/README.md). Không commit API key, file quy chế nội bộ, thư mục `.chroma` hoặc file upload lên Git.

## Bảo mật

- Không dùng secret mẫu trong môi trường production.
- Public registration chỉ tạo role `STUDENT`.
- File hồ sơ chỉ tải qua endpoint có xác thực.
- CORS phải giới hạn theo domain frontend triển khai.
- Backend legacy trong `server/` sẽ được loại bỏ sau khi frontend chuyển hoàn toàn sang API mới.
