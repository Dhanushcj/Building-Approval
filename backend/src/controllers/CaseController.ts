import { Request, Response } from 'express';
import prisma from '../prisma';
import { caseStateService } from '../services/CaseStateService';

export class CaseController {
  async createCase(req: Request, res: Response) {
    try {
      const data = req.body;
      const newCase = await prisma.case.create({ data });
      res.status(201).json(newCase);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const caseData = await prisma.case.findUnique({
        where: { id: id as string },
        include: {
          documents: true,
          fees: true,
          status_history: true,
          child_cases: true,
        },
      });
      if (!caseData) return res.status(404).json({ error: 'Not found' });
      res.json(caseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listCases(req: Request, res: Response) {
    try {
      const { status, jurisdiction, assigned_staff_id } = req.query;
      
      const cases = await prisma.case.findMany({
        where: {
          ...(status ? { status: status as any } : {}),
          ...(assigned_staff_id ? { assigned_staff_id: String(assigned_staff_id) } : {}),
          ...(jurisdiction
            ? { property: { jurisdiction: jurisdiction as any } }
            : {}),
        },
        include: { property: true },
      });
      res.json(cases);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const userId = (req as any).user.id; // From auth middleware
      
      await caseStateService.changeStatus(id as string, status, userId, note);
      
      const updatedCase = await prisma.case.findUnique({ where: { id: id as string } });
      res.json(updatedCase);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const caseController = new CaseController();
