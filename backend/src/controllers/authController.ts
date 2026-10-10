import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prisma.js';

const tokenFor = (user: { id: string; email: string; role: string }) => jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '8h' });

export async function login(req: Request, res: Response) {
  const { identifier, password } = req.body as { identifier?: string; password?: string };
  if (!identifier || !password) return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu' });
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier.toLowerCase() }, { code: identifier }] } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return res.json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, code: user.code, role: user.role, phone: user.phone, department: user.department } });
}

export async function register(req: Request, res: Response) {
  const { name, email, code, password, phone, department } = req.body;
  if (!name || !email || !code || !password) return res.status(400).json({ message: 'Thiếu trường đăng ký bắt buộc' });
  if (!/@tbu\.edu\.vn$/i.test(email)) return res.status(400).json({ message: 'Email phải thuộc tên miền @tbu.edu.vn' });
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), code, passwordHash, phone, department, role: 'STUDENT' } });
    return res.status(201).json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, code: user.code, role: user.role } });
  } catch (error) {
    return res.status(409).json({ message: 'Email hoặc mã định danh đã tồn tại' });
  }
}
