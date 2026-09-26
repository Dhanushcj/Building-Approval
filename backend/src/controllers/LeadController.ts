import { Request, Response } from 'express';
import prisma from '../prisma';
import { BrevoNotificationService } from '../services/BrevoNotificationService';

const notificationService = new BrevoNotificationService();

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, location } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const newLead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        location,
        projectType: 'General Enquiry',
        propertyDetails: 'General Enquiry via Popup',
        status: 'New'
      }
    });

    if (email) {
      // Send thank you email asynchronously
      notificationService.notifyLeadThanks(email, name).catch(err => {
        console.error('Failed to send thank you email for lead:', err);
      });
    }

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, assignedTo } = req.body;
    
    const lead = await prisma.lead.update({
      where: { id },
      data: { status, assignedTo }
    });
    
    res.status(200).json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};
