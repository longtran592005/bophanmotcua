# Hướng dẫn Database TBU One-Stop

Schema và seed PostgreSQL chính thức nằm tại:

- [backend/database/schema.sql](./backend/database/schema.sql)
- [backend/database/seed.sql](./backend/database/seed.sql)
- [backend/prisma/schema.prisma](./backend/prisma/schema.prisma)

## Cấu hình an toàn

Không lưu thông tin đăng nhập thật trong Git. Tạo `backend/.env` từ
`backend/.env.example` và tự điền `DATABASE_URL`, `JWT_SECRET`.

## Khởi tạo PostgreSQL

```powershell
psql "$env:DATABASE_URL" -f backend/database/schema.sql
psql "$env:DATABASE_URL" -f backend/database/seed.sql
```

Hoặc dùng Prisma:

```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

## Các nhóm dữ liệu

- Người dùng, vai trò và trạng thái tài khoản
- Thủ tục, các bước xử lý và thành phần hồ sơ
- Biểu mẫu và lượt tải
- Quy trình liên phòng ban
- Hồ sơ, file, timeline và ghi chú nội bộ
- Knowledge Base, chunks và trạng thái index
- FAQ, tin tức
- Settings và notifications

Seed data có tài khoản demo với mật khẩu mặc định. Chỉ sử dụng trong môi trường
phát triển và phải đổi mật khẩu trước khi triển khai thật.
