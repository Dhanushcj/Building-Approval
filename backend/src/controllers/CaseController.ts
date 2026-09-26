import { Request, Response } from 'express';
import prisma from '../prisma';
import { caseStateService } from '../services/CaseStateService';

export class CaseController {
  async createCase(req: Request, res: Response) {
    console.log("createCase hit with body:", req.body);
    try {
      const data = req.body;
      
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const count = await prisma.case.count({
        where: {
          created_at: {
            gte: startOfDay,
          }
        }
      });
      
      const formattedCount = String(count + 1).padStart(3, '0');
      const application_number = `APP-${yy}${mm}${dd}-${formattedCount}`;
      console.log("Generated application_number:", application_number);
      
      const newCase = await prisma.case.create({ 
        data: {
          ...data,
          application_number
        } 
      });
      console.log("Created case:", newCase);
      res.status(201).json(newCase);
    } catch (error: any) {
      console.error("Error creating case:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async getCase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const caseData = await prisma.case.findFirst({
        where: id.startsWith('APP-') 
          ? { application_number: id } 
          : { id },
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
      
      let caseIdToUpdate = id;
      if (id.startsWith('APP-')) {
        const found = await prisma.case.findFirst({ where: { application_number: id } });
        if (!found) return res.status(404).json({ error: 'Case not found' });
        caseIdToUpdate = found.id;
      }
      
      await caseStateService.changeStatus(caseIdToUpdate, status, userId, note);
      
      const updatedCase = await prisma.case.findUnique({ where: { id: caseIdToUpdate } });
      res.json(updatedCase);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const caseController = new CaseController();
