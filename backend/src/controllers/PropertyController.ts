import { Request, Response } from 'express';
import prisma from '../prisma';

export class PropertyController {
  async createProperty(req: Request, res: Response) {
    try {
      const data = req.body;
      const property = await prisma.property.create({ data });
      res.status(201).json(property);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await prisma.property.findUnique({
        where: { id: id as string },
        include: { cases: true },
      });
      if (!property) return res.status(404).json({ error: 'Not found' });
      res.json(property);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listProperties(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const properties = await prisma.property.findMany({
        where: search
          ? {
              OR: [
                { owner_name: { contains: String(search), mode: 'insensitive' } },
                { owner_phone: { contains: String(search) } },
                { survey_number: { contains: String(search) } },
              ],
            }
          : undefined,
      });
      res.json(properties);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const propertyController = new PropertyController();
