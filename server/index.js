import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { pool, query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET phải được cấu hình và dài tối thiểu 32 ký tự');
}

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(value => value.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin không được phép'));
} }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.json());
const uploadDirectory = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const upload = multer({
  dest: uploadDirectory,
  limits: { fileSize: 20 * 1024 * 1024 }
});
app.use('/uploads', express.static(uploadDirectory));

// Auth Middleware
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này' });
    next();
  };
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), database: 'PostgreSQL 18 - tbu_motcua_db' });
});

// 2. AUTHENTICATION
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrCode, password } = req.body;
    if (!emailOrCode || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email/mã số và mật khẩu' });
    }

    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1 OR code = $1',
      [emailOrCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Tài khoản không tồn tại trong hệ thống' });
    }

    const user = rows[0];
    if (user.status === 'Locked') {
      return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu không chính xác' });
    }

    // Update last login
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, code: user.code, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        code: user.code,
        role: user.role,
        phone: user.phone,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, code, password, phone, department } = req.body;
    if (!name || !email || !code || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    if (!/@tbu\.edu\.vn$/i.test(email) || password.length < 8) {
      return res.status(400).json({ error: 'Email phải thuộc @tbu.edu.vn và mật khẩu tối thiểu 8 ký tự' });
    }
    const existing = await query('SELECT id FROM users WHERE email = $1 OR code = $2', [email.toLowerCase(), code]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email hoặc mã sinh viên/cán bộ đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (name, email, code, password, role, phone, department)
       VALUES ($1, $2, $3, $4, 'Sinh viên', $5, $6) RETURNING id, name, email, code, role, phone, department`,
      [name, email.toLowerCase(), code, hashedPassword, phone, department]
    );

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, code: user.code, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký tài khoản' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, code, role, phone, department, status, created_at FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// 3. THỦ TỤC HÀNH CHÍNH (PROCEDURES)
app.get('/api/procedures', async (req, res) => {
  try {
    const { q, dept, audience } = req.query;
    let sql = 'SELECT * FROM procedures WHERE 1=1';
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (dept) {
      params.push(dept);
      sql += ` AND dept = $${params.length}`;
    }
    if (audience && audience !== 'Tất cả') {
      params.push(audience);
      sql += ` AND audience = $${params.length}`;
    }

    sql += ' ORDER BY id ASC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Get procedures error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách thủ tục' });
  }
});

app.get('/api/procedures/:codeOrId', async (req, res) => {
  try {
    const { codeOrId } = req.params;
    const isId = /^\d+$/.test(codeOrId);
    const sql = isId ? 'SELECT * FROM procedures WHERE id = $1' : 'SELECT * FROM procedures WHERE code = $1';
    const { rows } = await query(sql, [codeOrId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy thủ tục' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy chi tiết thủ tục' });
  }
});

app.post('/api/procedures', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { code, name, dept, dept_short, audience, time, fee = 0, description, details, steps = [], requirements = [] } = req.body;
    const generatedCode = code || `TT-NEW-${Date.now().toString().slice(-4)}`;
    const { rows } = await query(
      `INSERT INTO procedures (code, name, dept, dept_short, audience, time, fee, description, details, steps, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [generatedCode, name, dept, dept_short || 'VP', audience, time, fee, description, details, JSON.stringify(steps), JSON.stringify(requirements)]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi thêm thủ tục mới' });
  }
});

app.put('/api/procedures/:code', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { code } = req.params;
    const { name, dept, dept_short, audience, time, fee, description, details, steps, requirements, is_active } = req.body;
    const { rows } = await query(
      `UPDATE procedures SET
         name = COALESCE($1, name),
         dept = COALESCE($2, dept),
         dept_short = COALESCE($3, dept_short),
         audience = COALESCE($4, audience),
         time = COALESCE($5, time),
         fee = COALESCE($6, fee),
         description = COALESCE($7, description),
         details = COALESCE($8, details),
         steps = COALESCE($9, steps),
         requirements = COALESCE($10, requirements),
         is_active = COALESCE($11, is_active)
       WHERE code = $12 RETURNING *`,
      [name, dept, dept_short, audience, time, fee, description, details, steps ? JSON.stringify(steps) : null, requirements ? JSON.stringify(requirements) : null, is_active, code]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy thủ tục' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật thủ tục' });
  }
});

app.delete('/api/procedures/:code', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const { code } = req.params;
    await query('DELETE FROM procedures WHERE code = $1', [code]);
    res.json({ message: 'Đã xóa thủ tục thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi xóa thủ tục' });
  }
});

// 4. BIỂU MẪU (FORMS)
app.get('/api/forms', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM forms ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách biểu mẫu' });
  }
});

app.post('/api/forms', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { name, category, dept, version = 'v1.0', type = 'PDF', size = '200 KB' } = req.body;
    const code = `BM-NEW-${Date.now().toString().slice(-4)}`;
    const { rows } = await query(
      `INSERT INTO forms (code, name, category, dept, version, type, size)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [code, name, category, dept, version, type, size]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi thêm biểu mẫu' });
  }
});

app.delete('/api/forms/:code', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    await query('DELETE FROM forms WHERE code = $1', [req.params.code]);
    res.json({ message: 'Đã xóa biểu mẫu' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi xóa biểu mẫu' });
  }
});

// 5. HỒ SƠ / YÊU CẦU (APPLICATIONS)
app.get('/api/applications', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { q, status, dept, email } = req.query;
    let sql = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (code ILIKE $${params.length} OR applicant_name ILIKE $${params.length} OR procedure_name ILIKE $${params.length})`;
    }
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    if (dept) {
      params.push(dept);
      sql += ` AND dept = $${params.length}`;
    }
    if (email) {
      params.push(email);
      sql += ` AND email = $${params.length}`;
    }

    sql += ' ORDER BY id DESC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách hồ sơ' });
  }
});

// Tra cứu hồ sơ theo mã hoặc CCCD/MSV
app.get('/api/applications/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const appResult = await query(
      'SELECT * FROM applications WHERE code = $1 LIMIT 1',
      [code]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ với thông tin đã nhập' });
    }

    const application = appResult.rows[0];
    const timeline = await query('SELECT status, staff_name, note, created_at FROM application_timeline WHERE application_code = $1 ORDER BY created_at ASC', [application.code]);

    res.json({
      code: application.code,
      applicant_name: application.applicant_name,
      procedure_name: application.procedure_name,
      dept: application.dept,
      status: application.status,
      submitted_date: application.submitted_date,
      timeline: timeline.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tra cứu hồ sơ' });
  }
});

// Nộp hồ sơ trực tuyến mới
app.post('/api/applications', authenticate, async (req, res) => {
  try {
    const { applicant_name, applicant_code, email, phone, dept, procedure_name, procedure_code, files = [] } = req.body;
    if ((email && email.toLowerCase() !== String(req.user.email).toLowerCase()) || (applicant_code && applicant_code !== req.user.code)) {
      return res.status(403).json({ error: 'Thông tin người nộp không khớp tài khoản đăng nhập' });
    }
    if (!applicant_name || !procedure_name || !procedure_code || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Dữ liệu hồ sơ không hợp lệ' });
    }
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `HS-2026-00${randomDigits}`;

    const { rows } = await query(
      `INSERT INTO applications (code, applicant_name, applicant_code, email, phone, dept, procedure_name, procedure_code, status, priority, files)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Tiếp nhận', 'blue', $9) RETURNING *`,
      [code, applicant_name, applicant_code, email, phone, dept || 'Bộ phận Một cửa', procedure_name, procedure_code, JSON.stringify(files)]
    );

    // Add initial timeline
    await query(
      `INSERT INTO application_timeline (application_code, status, staff_name, note)
       VALUES ($1, 'Đã tiếp nhận', 'Cổng Một cửa điện tử', 'Hồ sơ đã được gửi thành công lên hệ thống.')`,
      [code]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Lỗi nộp hồ sơ trực tuyến' });
  }
});

app.post('/api/uploads', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Chưa có tệp được tải lên' });
  res.status(201).json({
    name: req.file.originalname,
    size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
    mimeType: req.file.mimetype,
    url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  });
});

// Chuyển trạng thái hồ sơ (Kanban & Chi tiết)
app.put('/api/applications/:code/status', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { code } = req.params;
    const { status, staff_name = 'Admin', note } = req.body;

    const { rows } = await query(
      'UPDATE applications SET status = $1, assigned_staff = $2, note = COALESCE($3, note) WHERE code = $4 RETURNING *',
      [status, staff_name, note, code]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });

    // Insert timeline record
    await query(
      `INSERT INTO application_timeline (application_code, status, staff_name, note)
       VALUES ($1, $2, $3, $4)`,
      [code, status, staff_name, note || `Chuyển trạng thái sang ${status}`]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái hồ sơ' });
  }
});

// Thêm ghi chú nội bộ cho hồ sơ
app.post('/api/applications/:code/notes', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const { code } = req.params;
    const { author = 'Admin', text } = req.body;
    if (!text) return res.status(400).json({ error: 'Nội dung ghi chú không được trống' });

    const { rows } = await query(
      'INSERT INTO application_notes (application_code, author, text) VALUES ($1, $2, $3) RETURNING *',
      [code, author, text]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi thêm ghi chú' });
  }
});

// 6. THỐNG KÊ (DASHBOARD & REPORTS)
app.get('/api/stats', authenticate, requireRole('Admin', 'Cán bộ xử lý'), async (req, res) => {
  try {
    const totalApps = await query('SELECT COUNT(*) FROM applications');
    const processingApps = await query("SELECT COUNT(*) FROM applications WHERE status = 'Đang xử lý'");
    const completedApps = await query("SELECT COUNT(*) FROM applications WHERE status = 'Hoàn thành' OR status = 'Trả kết quả'");
    const pendingApps = await query("SELECT COUNT(*) FROM applications WHERE status = 'Tiếp nhận'");

    const deptDist = await query(`
      SELECT dept as name, COUNT(*) as value
      FROM applications GROUP BY dept
    `);

    res.json({
      total: parseInt(totalApps.rows[0].count, 10),
      processing: parseInt(processingApps.rows[0].count, 10),
      completed: parseInt(completedApps.rows[0].count, 10),
      pending: parseInt(pendingApps.rows[0].count, 10),
      departments: deptDist.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy dữ liệu thống kê' });
  }
});

// 7. FAQs & NEWS & SETTINGS
app.get('/api/faqs', async (req, res) => {
  const { rows } = await query('SELECT * FROM faqs ORDER BY id ASC');
  res.json(rows);
});

app.get('/api/news', async (req, res) => {
  const { rows } = await query('SELECT * FROM news ORDER BY published_at DESC');
  res.json(rows);
});

app.get('/api/users', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, code, role, phone, department, status, created_at, last_login FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách người dùng' });
  }
});

app.get('/api/settings', authenticate, requireRole('Admin'), async (req, res) => {
  const { rows } = await query('SELECT * FROM system_settings');
  const settingsObj = {};
  rows.forEach(r => { settingsObj[r.key] = r.value; });
  res.json(settingsObj);
});

app.post('/api/settings', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO system_settings (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, String(value)]
      );
    }
    res.json({ message: 'Lưu cài đặt thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lưu cài đặt' });
  }
});

// 8. AI CHATBOT WITH RAG CONTEXT
app.post('/api/ai/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Nội dung câu hỏi không được để trống' });

    // Retrieve live context from database (Procedures & FAQs)
    const procRows = await query('SELECT code, name, dept, time, fee, description, steps FROM procedures LIMIT 10');
    const faqRows = await query('SELECT question, answer FROM faqs LIMIT 5');

    const lower = message.toLowerCase();

    // Check matching procedure
    const matchedProc = procRows.rows.find(p => lower.includes(p.name.toLowerCase()) || lower.includes(p.code.toLowerCase()) || (p.code.includes('ĐT') && lower.includes('sinh viên')) || (p.code.includes('TCCB') && lower.includes('nghỉ phép')));

    if (matchedProc) {
      return res.json({
        type: 'guide',
        text: `Chào bạn! Về thủ tục **${matchedProc.name}** (${matchedProc.dept}):\n- **Thời gian xử lý:** ${matchedProc.time}\n- **Lệ phí:** ${matchedProc.fee === '0' || matchedProc.fee === 0 ? 'Miễn phí' : `${Number(matchedProc.fee).toLocaleString()} VNĐ`}\n- **Mô tả:** ${matchedProc.description}`,
        procedure: matchedProc.name,
        dept: matchedProc.dept,
        time: matchedProc.time,
        steps: Array.isArray(matchedProc.steps) ? matchedProc.steps.map(s => [s.name, s.desc]) : [
          ['Chuẩn bị hồ sơ', 'Điền đầy đủ đơn theo mẫu và các giấy tờ đính kèm.'],
          ['Nộp hồ sơ trực tuyến', 'Tải tài liệu lên Cổng dịch vụ Một cửa.'],
          ['Nhận kết quả', 'Theo dõi tiến trình qua mã hồ sơ và nhận kết quả đúng hẹn.']
        ]
      });
    }

    if (lower.includes('hồ sơ') && (lower.includes('tra cứu') || lower.includes('tiến độ'))) {
      return res.json({
        type: 'text',
        text: 'Để tra cứu tiến độ xử lý hồ sơ, bạn hãy truy cập vào mục **Tra cứu** trên thanh menu và nhập mã hồ sơ của bạn (Ví dụ: `HS-2026-001234`). Hệ thống sẽ hiển thị chi tiết tiến trình từng bước!'
      });
    }

    res.json({
      type: 'text',
      text: `Trợ lý AI Một cửa đã ghi nhận câu hỏi của bạn: "${message}".\nBạn có thể tra cứu danh mục thủ tục của Trường Đại học Thái Bình, nộp hồ sơ trực tuyến hoặc tải các biểu mẫu hành chính mới nhất tại cổng thông tin này!`
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Lỗi xử lý câu hỏi AI' });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TBU ONE-STOP BACKEND IS RUNNING AT http://localhost:${PORT}`);
  console.log(`📊 Connected to PostgreSQL: tbu_motcua_db`);
  console.log(`=======================================================`);
});
