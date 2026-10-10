import { Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import path from 'node:path';
import fs from 'node:fs';

export const listApplications = async (_req: Request, res: Response) => res.json(await prisma.application.findMany({ include: { applicant: true, procedure: true, assignedStaff: true }, orderBy: { submittedAt: 'desc' } }));
export const trackApplication = async (req: Request, res: Response) => {
  const item = await prisma.application.findUnique({ where: { code: String(req.params.code) }, include: { applicant: true, procedure: true, timeline: { orderBy: { createdAt: 'asc' } } } });
  return item ? res.json(item) : res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
};
export const downloadApplicationFile = async (req: AuthRequest, res: Response) => {
  const file = await prisma.applicationFile.findUnique({ where: { id: String(req.params.fileId) }, include: { application: true } });
  if (!file || !req.user) return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
  const isStaff = ['ADMIN', 'STAFF'].includes(req.user.role);
  if (!isStaff && file.application.applicantId !== req.user.id) return res.status(403).json({ message: 'Bạn không có quyền tải tài liệu này' });
  if (!fs.existsSync(file.storageUrl)) return res.status(404).json({ message: 'Tệp lưu trữ không tồn tại' });
  return res.download(path.resolve(file.storageUrl), file.originalName);
};
export const createApplication = async (req: AuthRequest, res: Response) => {
  const { procedureId, priority, expectedAt } = req.body;
  if (!procedureId || !req.user?.id) return res.status(400).json({ message: 'Thiếu thủ tục hoặc người nộp hồ sơ' });
  const code = `HS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const files = (req.files as Express.Multer.File[] | undefined) || [];
  const item = await prisma.application.create({ data: { code, applicantId: req.user.id, procedureId, priority, expectedAt: expectedAt ? new Date(expectedAt) : undefined, department: 'Bộ phận Một cửa', files: { create: files.map(file => ({ originalName: file.originalname, storedName: file.filename, mimeType: file.mimetype, fileSize: file.size, storageUrl: file.path })) }, timeline: { create: { status: 'Tiếp nhận', staffName: 'Hệ thống', note: 'Hồ sơ đã được tiếp nhận.' } } }, include: { procedure: true, files: true } });
  return res.status(201).json(item);
};
export const updateApplication = async (req: Request, res: Response) => res.json(await prisma.application.update({ where: { id: String(req.params.id) }, data: req.body, include: { timeline: true } }));
