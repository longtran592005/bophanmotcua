-- CSDL PostgreSQL cho Cổng dịch vụ hành chính Một cửa điện tử TBU.
-- Chạy trên PostgreSQL 14+.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE CHECK (email = lower(email)),
  code VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN','STAFF','STUDENT','FACULTY')),
  phone VARCHAR(30),
  department VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','LOCKED','INACTIVE')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(150) NOT NULL,
  audience VARCHAR(100) NOT NULL DEFAULT 'Tất cả',
  processing_time VARCHAR(80) NOT NULL DEFAULT '3 ngày',
  fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  description TEXT,
  details TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS procedure_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  step_order SMALLINT NOT NULL CHECK (step_order > 0),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(150),
  duration VARCHAR(80),
  form_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (procedure_id, step_order)
);

CREATE TABLE IF NOT EXISTS procedure_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  original_copies SMALLINT NOT NULL DEFAULT 1,
  duplicate_copies SMALLINT NOT NULL DEFAULT 0,
  preparation_note TEXT,
  form_id UUID,
  display_order SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(150) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
  file_type VARCHAR(10) NOT NULL DEFAULT 'PDF' CHECK (file_type IN ('PDF','DOC','DOCX')),
  file_size VARCHAR(50),
  file_url TEXT,
  downloads INTEGER NOT NULL DEFAULT 0 CHECK (downloads >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE procedure_requirements
  DROP CONSTRAINT IF EXISTS procedure_requirements_form_id_fkey;
ALTER TABLE procedure_requirements
  ADD CONSTRAINT procedure_requirements_form_id_fkey
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  step_order SMALLINT NOT NULL CHECK (step_order > 0),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(150),
  assignee_role VARCHAR(80),
  duration VARCHAR(80),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (process_id, step_order)
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) NOT NULL UNIQUE CHECK (code ~ '^HS-[0-9]{4}-[0-9]{6}$'),
  applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE RESTRICT,
  department VARCHAR(150) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Tiếp nhận'
    CHECK (status IN ('Tiếp nhận','Đang xử lý','Chờ bổ sung','Hoàn thành','Trả kết quả')),
  priority VARCHAR(20) NOT NULL DEFAULT 'green' CHECK (priority IN ('red','yellow','green')),
  assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS application_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255),
  mime_type VARCHAR(120),
  file_size BIGINT CHECK (file_size >= 0),
  storage_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS application_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  staff_name VARCHAR(150),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS application_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  file_type VARCHAR(20) DEFAULT 'PDF',
  file_size VARCHAR(50),
  storage_url TEXT,
  chunk_count INTEGER NOT NULL DEFAULT 0,
  index_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  indexed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  token_count INTEGER,
  page_number INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding JSONB,
  UNIQUE (document_id, chunk_index)
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Thủ tục chung',
  display_order INTEGER NOT NULL DEFAULT 1,
  views INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Thông báo',
  content TEXT NOT NULL,
  excerpt TEXT,
  thumbnail_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150),
  views INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('PUBLISHED','DRAFT')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL DEFAULT 'info' CHECK (type IN ('new_application','status_update','overdue','info')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_code ON users(code);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_procedures_code ON procedures(code);
CREATE INDEX IF NOT EXISTS idx_procedures_department_active ON procedures(department, is_active);
CREATE INDEX IF NOT EXISTS idx_forms_category_department ON forms(category, department);
CREATE INDEX IF NOT EXISTS idx_applications_code ON applications(code);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_department ON applications(department);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_application_created ON application_timeline(application_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notes_application_created ON application_notes(application_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON knowledge_chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
