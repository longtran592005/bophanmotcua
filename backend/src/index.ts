import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import authRoutes from './routes/api/v1/auth.js';
import procedureRoutes from './routes/api/v1/procedures.js';
import applicationRoutes from './routes/api/v1/applications.js';
import formRoutes from './routes/api/v1/forms.js';
import statisticsRoutes from './routes/api/v1/statistics.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(value => value.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin không được phép'));
} }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', (_req, res) => res.status(404).json({ message: 'Tài liệu chỉ được tải qua endpoint có kiểm tra quyền' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'tbu-one-stop-backend' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/procedures', procedureRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/forms', formRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Không tìm thấy tài nguyên' }));
const errors: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
};
app.use(errors);
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Backend listening on port ${port}`));
