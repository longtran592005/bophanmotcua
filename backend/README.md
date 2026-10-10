# Backend API

Backend độc lập cho Bộ phận Một cửa, dùng Node.js, Express, TypeScript, Prisma và PostgreSQL.

## Chạy local

1. Sao chép `.env.example` thành `.env` và đặt `DATABASE_URL`, `JWT_SECRET`.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run dev`

Nếu triển khai bằng SQL thuần, chạy lần lượt:

```text
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

Hai file [database/schema.sql](./database/schema.sql) và [database/seed.sql](./database/seed.sql) là bản DDL/seed tương đương với [prisma/schema.prisma](./prisma/schema.prisma), bao gồm users, procedures, forms, processes, applications, timeline, notes, knowledge base, FAQ, news, settings và notifications.

Health check: `GET /health`.

API chính:

- `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- `GET/POST/PUT/DELETE /api/v1/procedures`
- `GET/POST/PUT /api/v1/applications`, `GET /api/v1/applications/track/:code`
- `GET/POST /api/v1/forms`
- `GET /api/v1/statistics/summary`

Các endpoint quản trị cần Bearer JWT với role `ADMIN` hoặc `STAFF`. Hồ sơ nhận file qua multipart field `files`; biểu mẫu dùng field `file`.

## Lưu ý bảo mật triển khai

- Không dùng giá trị mẫu trong `.env.example`; tạo `JWT_SECRET` ngẫu nhiên tối thiểu 32 ký tự và đặt `CORS_ORIGINS` đúng domain frontend.
- Đăng ký công khai luôn tạo role `STUDENT`; chỉ quản trị viên được cấp quyền staff/admin qua quy trình quản trị riêng.
- File upload không được public static. Tải file phải dùng `GET /api/v1/applications/files/:fileId` với JWT và kiểm tra chủ hồ sơ/quyền cán bộ.
- Khi triển khai production cần đặt HTTPS, reverse-proxy security headers và thay toàn bộ secret đã từng xuất hiện trong môi trường phát triển.
