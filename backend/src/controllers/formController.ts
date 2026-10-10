import { Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
export const listForms = async (_req: Request, res: Response) => res.json(await prisma.form.findMany({ orderBy: { createdAt: 'desc' } }));
export const createForm = async (req: Request, res: Response) => res.status(201).json(await prisma.form.create({ data: { ...req.body, fileUrl: req.file?.path, size: req.file ? `${Math.round(req.file.size / 1024)} KB` : req.body.size } }));
