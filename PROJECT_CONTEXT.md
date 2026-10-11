# TBU One-Stop Service - Project Context

## 1. Tổng quan

Đây là website **Cổng dịch vụ hành chính Một cửa điện tử - Trường Đại học Thái Bình (TBU One-Stop Service)**.

Mục tiêu của hệ thống:

- Số hóa việc tiếp nhận và xử lý thủ tục hành chính trong trường.
- Cho phép sinh viên, cán bộ/giảng viên tra cứu thủ tục, tải biểu mẫu và nộp hồ sơ trực tuyến.
- Cho phép cán bộ Một cửa và quản trị viên quản lý hồ sơ theo Kanban.
- Cho phép người dùng theo dõi tiến độ xử lý hồ sơ.
- Cung cấp chatbot AI tiếng Việt hỗ trợ thủ tục, biểu mẫu và quy trình.
- Chuẩn bị nền tảng backend PostgreSQL và RAG service để phát triển production.

Ngôn ngữ giao diện chính: **Tiếng Việt**.

Đơn vị: **Trường Đại học Thái Bình**.

---

## 2. Công nghệ sử dụng

### Frontend

- React 18
- Vite
- JavaScript/JSX
- React Context
- LocalStorage persistence
- React Router dạng manual routing trong `src/main.jsx`
- Lucide React cho icon
- Recharts cho biểu đồ
- Framer Motion cho animation
- QRCode cho phiếu tiếp nhận

### Backend mới

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs
- Multer upload file
- Helmet security headers
- express-rate-limit

### RAG service

- Python FastAPI
- Gemini API
- ChromaDB
- PyPDF
- python-docx
- LangChain text splitter
- JWT bảo vệ API

---

## 3. Cấu trúc thư mục

```text
.
├── src/
│   ├── main.jsx              # Frontend chính, routing và các màn hình
│   ├── styles.css            # CSS toàn hệ thống
│   └── api.js                # Một số helper gọi API legacy
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth, procedure, form, application, statistics
│   │   ├── middleware/       # JWT auth, role guard, upload validation
│   │   ├── models/           # Prisma client
│   │   ├── routes/api/v1/    # REST API version 1
│   │   └── index.ts          # Entry point Express
│   ├── database/
│   │   ├── schema.sql        # PostgreSQL DDL đầy đủ
│   │   └── seed.sql          # Dữ liệu mẫu TBU
│   ├── prisma/schema.prisma  # Prisma data model
│   ├── .env.example
│   └── README.md
│
├── rag-service/
│   ├── app/main.py           # FastAPI RAG service
│   ├── documents/            # Tài liệu PDF/DOCX để ingest
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── server/
│   ├── index.js              # Backend legacy để tương thích
│   ├── db.js
│   ├── schema.sql
│   └── seed.js
│
├── index.html
├── package.json
├── README.md
└── .gitignore
```

### Quy ước backend

- `backend/` là backend mới được ưu tiên cho phát triển tiếp theo.
- `server/` là backend legacy, chỉ giữ để tương thích các luồng cũ.
- Không tạo thêm API mới trong `server/` nếu có thể triển khai trong `backend/`.
- Không commit `.env`, API key, database password, uploads hoặc Chroma database.

---

## 4. Frontend hiện tại

Frontend hiện nằm trong một file lớn là `src/main.jsx`. Đây là chủ ý hiện tại của prototype để dễ triển khai nhanh; khi mở rộng production nên tách dần thành:

```text
src/
├── components/
├── pages/
├── layouts/
├── contexts/
├── services/
├── hooks/
└── data/
```

Frontend hiện có:

- Header public
- Footer
- Dark/light mode
- Responsive desktop, tablet và mobile
- Toast notification
- Loading skeleton
- Error/empty states
- Modal/dialog
- Focus ring và một số ARIA label
- Chatbot floating widget
- Manual navigation bằng `history.pushState`

---

## 5. Các route public

| Route | Chức năng |
|---|---|
| `/` | Trang chủ, giới thiệu dịch vụ và thủ tục nổi bật |
| `/procedures` | Danh sách thủ tục hành chính |
| `/procedures/:id` | Chi tiết một thủ tục |
| `/forms` | Kho biểu mẫu |
| `/apply` | Nộp hồ sơ trực tuyến theo từng bước |
| `/track` | Tra cứu tiến độ hồ sơ |
| `/news` | Tin tức và thông báo |
| `/profile` | Hồ sơ cá nhân |
| `/login` | Đăng nhập |
| `/register` | Đăng ký tài khoản |
| `/forgot-password` | Khôi phục mật khẩu |
| `/404` | Trang không tìm thấy |

### Chi tiết thủ tục

Trang `/procedures/:id` có:

- Breadcrumb
- Mã và tên thủ tục
- Phòng ban phụ trách
- Thời hạn xử lý
- Lệ phí
- Đối tượng áp dụng
- Hình thức tiếp nhận
- Tab trình tự thực hiện
- Tab hồ sơ yêu cầu
- Tab biểu mẫu đính kèm
- Tab căn cứ pháp lý và FAQ
- Nút nộp hồ sơ online
- Nút tải toàn bộ biểu mẫu
- Nút hỏi AI về thủ tục

### Nộp hồ sơ

Luồng `/apply` tạo hồ sơ với:

- Mã dạng `HS-2026-XXXX`
- Người nộp
- Thủ tục
- File đính kèm
- Thời gian nộp
- Trạng thái ban đầu `Tiếp nhận`
- Timeline ban đầu

---

## 6. Admin portal

Tất cả route `/admin/*` yêu cầu role quản trị hoặc cán bộ xử lý.

| Route | Chức năng |
|---|---|
| `/admin` | Dashboard tổng quan |
| `/admin/procedures` | Quản lý thủ tục |
| `/admin/forms` | Quản lý biểu mẫu |
| `/admin/processes` | Quản lý quy trình |
| `/admin/applications` | Quản lý hồ sơ và Kanban |
| `/admin/knowledge-base` | Quản lý tài liệu RAG |
| `/admin/users` | Quản lý người dùng và quyền |
| `/admin/faq` | Quản lý FAQ |
| `/admin/news` | Quản lý tin tức |
| `/admin/reports` | Thống kê và báo cáo |
| `/admin/settings` | Cấu hình AI, đơn vị và backup |

### Kanban hồ sơ

Trạng thái chuẩn:

1. `Tiếp nhận`
2. `Đang xử lý`
3. `Chờ bổ sung`
4. `Hoàn thành`
5. `Trả kết quả`

Mức ưu tiên:

- `red`: Khẩn cấp
- `yellow`: Bình thường
- `green`: Thấp

Admin có thể:

- Kéo thả hồ sơ giữa các cột.
- Xem chi tiết hồ sơ.
- Phân công cán bộ.
- Cập nhật trạng thái.
- Thêm ghi chú nội bộ.
- Xem timeline.
- In phiếu tiếp nhận và hẹn trả kết quả.
- Xuất danh sách hồ sơ CSV UTF-8 BOM.

---

## 7. Authentication và roles

Roles chuẩn:

| Role | Ý nghĩa |
|---|---|
| `ADMIN` | Toàn quyền quản trị |
| `STAFF` | Cán bộ xử lý Một cửa |
| `STUDENT` | Sinh viên |
| `FACULTY` | Cán bộ/giảng viên |

Frontend hiện lưu phiên trong LocalStorage dưới key `currentUser`.

Backend mới dùng:

- JWT Bearer token
- bcrypt password hash
- Public registration luôn tạo role `STUDENT`
- Không tin role do client gửi
- Admin/Staff mới được thực hiện thao tác quản trị

Không được khôi phục cơ chế cho phép đăng nhập bằng mật khẩu cố định trong production.

---

## 8. Data Store frontend

Frontend có Data Store trung tâm bằng React Context và LocalStorage.

Các nhóm dữ liệu:

- `procedures`
- `forms`
- `applications`
- `knowledgeBase`
- `notifications`
- `institution`
- AI settings

Các key LocalStorage quan trọng:

```text
tbu-procedures
tbu-forms
tbu-applications
tbu-knowledge-base
tbu-notifications
tbu-institution
tbu-ai-settings
gemini_api_key
currentUser
```

Nếu LocalStorage chưa có dữ liệu, frontend tự seed dữ liệu mẫu.

Admin Settings có chức năng:

- Xuất backup JSON
- Nhập backup JSON
- Khôi phục dữ liệu mẫu
- Cấu hình Gemini
- Cấu hình thông tin cơ quan

API key Gemini không được đưa vào file backup.

---

## 9. Chatbot AI

Chatbot hỗ trợ:

- Text markdown
- Procedure card
- Step-by-step guide
- Form download card
- Status card
- FAQ accordion
- Suggested questions
- Chat history
- Full-screen mode
- Voice input tiếng Việt `vi-VN`
- Typing animation
- Offline fallback theo từ khóa

### Gemini

API key được đọc theo thứ tự:

1. `localStorage.getItem('gemini_api_key')`
2. `VITE_GEMINI_API_KEY`
3. Cấu hình Admin Settings

Không commit Gemini API key vào Git.

### RAG context frontend

Frontend hiện ghép context từ:

- Thủ tục
- Biểu mẫu
- Knowledge Base
- Một phần hồ sơ

RAG service production nằm riêng tại `rag-service/`, dùng ChromaDB và Gemini embedding.

---

## 10. Database

Schema chính thức nằm trong:

- `backend/database/schema.sql`
- `backend/prisma/schema.prisma`

Các nhóm bảng:

- Users
- Procedures
- Procedure steps
- Procedure requirements
- Forms
- Processes
- Applications
- Application files
- Application timeline
- Application notes
- Knowledge documents
- Knowledge chunks
- FAQs
- News
- System settings
- Notifications

Mã hồ sơ PostgreSQL yêu cầu dạng:

```text
HS-YYYY-XXXXXX
```

Seed data nằm trong `backend/database/seed.sql`.

---

## 11. REST API backend mới

Base URL mặc định: `http://localhost:5000`.

### Auth

```text
POST /api/v1/auth/login
POST /api/v1/auth/register
```

### Procedures

```text
GET    /api/v1/procedures
GET    /api/v1/procedures/:id
POST   /api/v1/procedures
PUT    /api/v1/procedures/:id
DELETE /api/v1/procedures/:id
```

### Applications

```text
GET  /api/v1/applications
POST /api/v1/applications
PUT  /api/v1/applications/:id
GET  /api/v1/applications/track/:code
GET  /api/v1/applications/files/:fileId
```

### Forms và statistics

```text
GET  /api/v1/forms
POST /api/v1/forms
GET  /api/v1/statistics/summary
GET  /health
```

File hồ sơ nhận qua multipart field `files`.

---

## 12. RAG service API

RAG service mặc định chạy tại `http://localhost:8000`.

```text
GET  /health
POST /ingest
POST /query
```

Yêu cầu bảo mật:

- `/query` cần Bearer JWT.
- `/ingest` chỉ cho Admin/Staff.
- Chỉ được ingest file trong thư mục `rag-service/documents`.
- Không truyền đường dẫn filesystem tuyệt đối từ client.

Pipeline:

```text
PDF/DOCX
  -> extract text
  -> chunk size 500
  -> overlap 50
  -> Gemini embedding
  -> ChromaDB
  -> similarity search Top-K
  -> Gemini answer
  -> citations tên tài liệu + số trang
```

---

## 13. Chạy dự án local

### Frontend

```powershell
npm install
npm run dev
```

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npx prisma generate
npm run build
npm run dev
```

Trước khi chạy, cần cấu hình:

```env
DATABASE_URL=
JWT_SECRET=
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### RAG

Python cần được cài đặt trước:

```powershell
cd rag-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

---

## 14. Kiểm thử và build

Frontend:

```powershell
npm run build
```

Backend:

```powershell
cd backend
npm run build
npx prisma validate
```

Legacy backend:

```powershell
cd server
node --check index.js
```

Python:

```powershell
python -m py_compile rag-service/app/main.py
```

---

## 15. Bảo mật bắt buộc

- Không commit `.env` hoặc secrets.
- Thay `JWT_SECRET` mẫu trước production.
- Rotate mọi secret đã từng xuất hiện trong môi trường local.
- Cấu hình CORS theo allowlist domain thật.
- Dùng HTTPS.
- Không public thư mục upload.
- File upload cần kiểm tra extension, MIME và kích thước.
- Không tin role từ request đăng ký.
- Không dùng mật khẩu demo trong production.
- Không trả ghi chú nội bộ qua API tracking public.
- Không dùng wildcard tracking hồ sơ.
- Giới hạn rate request.
- Dùng security headers.
- Bảo vệ endpoint RAG ingestion.

---

## 16. Những điểm cần nâng cấp tiếp

1. Tách `src/main.jsx` thành modules/components.
2. Chuyển frontend hoàn toàn từ LocalStorage sang backend API khi production.
3. Thêm refresh token và revoke token.
4. Thêm email OTP thật cho forgot password.
5. Dùng object storage riêng cho file hồ sơ.
6. Dùng vector database production cho RAG.
7. Thêm audit log cho thao tác Admin.
8. Thêm automated tests cho auth, authorization và application workflow.
9. Thêm CI/CD GitHub Actions.
10. Xóa `server/` sau khi frontend đã chuyển hoàn toàn sang `backend/`.

---

## 17. Hướng dẫn cho AI khác

Khi tiếp tục phát triển dự án:

1. Đọc file này trước.
2. Kiểm tra `git status` trước khi sửa.
3. Ưu tiên backend mới trong `backend/`.
4. Không tạo API trùng trong `server/` trừ khi sửa compatibility.
5. Giữ giao diện và nội dung tiếng Việt.
6. Tái sử dụng Data Store, schema và helper hiện có.
7. Không commit secrets hoặc dữ liệu người dùng thật.
8. Sau khi sửa frontend, chạy `npm run build`.
9. Sau khi sửa backend, chạy `npm run build` trong `backend`.
10. Khi thay đổi schema, cập nhật đồng thời `schema.sql`, `seed.sql` và `prisma/schema.prisma`.

