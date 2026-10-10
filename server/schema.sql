-- Schema for He thong Bo phan Mot cua - Truong Dai hoc Thai Binh

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Sinh viên',
    phone VARCHAR(50),
    department VARCHAR(150),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    dept VARCHAR(150) NOT NULL,
    dept_short VARCHAR(50),
    audience VARCHAR(100) DEFAULT 'Tất cả',
    time VARCHAR(50) DEFAULT '3 ngày',
    fee NUMERIC DEFAULT 0,
    description TEXT,
    details TEXT,
    steps JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    dept VARCHAR(100),
    version VARCHAR(20) DEFAULT 'v1.0',
    type VARCHAR(20) DEFAULT 'PDF',
    size VARCHAR(50) DEFAULT '250 KB',
    downloads INT DEFAULT 0,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dept VARCHAR(150),
    steps INT DEFAULT 4,
    flow_steps JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'Active',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_code VARCHAR(50),
    email VARCHAR(150),
    phone VARCHAR(50),
    dept VARCHAR(150),
    procedure_name VARCHAR(255) NOT NULL,
    procedure_code VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'green',
    status VARCHAR(50) DEFAULT 'Tiếp nhận',
    assigned_staff VARCHAR(150) DEFAULT 'Cán bộ Một cửa',
    note TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_date TIMESTAMP,
    completed_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_timeline (
    id SERIAL PRIMARY KEY,
    application_code VARCHAR(50) REFERENCES applications(code) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    staff_name VARCHAR(150),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_notes (
    id SERIAL PRIMARY KEY,
    application_code VARCHAR(50) REFERENCES applications(code) ON DELETE CASCADE,
    author VARCHAR(150),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_docs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    type VARCHAR(20) DEFAULT 'PDF',
    size VARCHAR(50) DEFAULT '1.2 MB',
    chunks INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Đã index',
    content_chunks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Thủ tục chung',
    views INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Thông báo',
    content TEXT,
    excerpt TEXT,
    author VARCHAR(150) DEFAULT 'Bộ phận Một cửa',
    views INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Published',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
