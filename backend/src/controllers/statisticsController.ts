import { Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
export const summary = async (_req: Request, res: Response) => {
  const [applications, completed, processing, procedures, forms] = await Promise.all([
    prisma.application.count(), prisma.application.count({ where: { status: 'Hoàn thành' } }), prisma.application.count({ where: { status: 'Đang xử lý' } }), prisma.procedure.count({ where: { isActive: true } }), prisma.form.count()
  ]);
  return res.json({ applications, completed, processing, activeProcedures: procedures, forms });
};
