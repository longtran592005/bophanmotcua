import { Request, Response } from 'express';
import { prisma } from '../models/prisma.js';

export const listProcedures = async (_req: Request, res: Response) => res.json(await prisma.procedure.findMany({ orderBy: { createdAt: 'desc' } }));
export const getProcedure = async (req: Request, res: Response) => {
  const item = await prisma.procedure.findUnique({ where: { id: String(req.params.id) } });
  return item ? res.json(item) : res.status(404).json({ message: 'Không tìm thấy thủ tục' });
};
export const createProcedure = async (req: Request, res: Response) => res.status(201).json(await prisma.procedure.create({ data: req.body }));
export const updateProcedure = async (req: Request, res: Response) => res.json(await prisma.procedure.update({ where: { id: String(req.params.id) }, data: req.body }));
export const deleteProcedure = async (req: Request, res: Response) => { await prisma.procedure.delete({ where: { id: String(req.params.id) } }); return res.status(204).send(); };
