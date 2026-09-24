import { CaseStatus } from '@prisma/client';
import prisma from '../prisma';
import { NotificationService } from './CaseStateService';

export class BrevoNotificationService implements NotificationService {
  private apiKey: string;
  private sender = { name: 'Build Approval ERP', email: 'no-reply@buildapprovalerp.com' };

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
  }

  private async sendEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: this.sender,
          to: [{ email: toEmail, name: toName }],
          subject: subject,
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo API Error:', error);
      } else {
        console.log(`[Email Sent] ${subject} to ${toEmail}`);
      }
    } catch (error) {
      console.error('Failed to send email via Brevo:', error);
    }
  }

  private async getCustomerDetails(caseId: string) {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        property: true
      }
    });
    return caseData;
  }

  async notifyStatusChange(caseId: string, oldStatus: CaseStatus, newStatus: CaseStatus): Promise<void> {
    const caseData = await this.getCustomerDetails(caseId);
    if (!caseData || !caseData.customer.email) return;

    const subject = `Update on your Building Application (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${caseData.customer.name},</h3>
      <p>The status of your building application at <strong>${caseData.property.address}</strong> has changed.</p>
      <p><strong>Old Status:</strong> ${oldStatus.replace(/_/g, ' ')}<br/>
      <strong>New Status:</strong> <span style="color: #0B63CE; font-weight: bold;">${newStatus.replace(/_/g, ' ')}</span></p>
      <p>You can track the progress of your application by logging into your dashboard.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(caseData.customer.email, caseData.customer.name, subject, htmlContent);
  }

  async notifyInspectionScheduled(caseId: string, date?: string): Promise<void> {
    const caseData = await this.getCustomerDetails(caseId);
    if (!caseData || !caseData.customer.email) return;

    const subject = `Inspection Scheduled - Application (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${caseData.customer.name},</h3>
      <p>An inspection has been scheduled for your property at <strong>${caseData.property.address}</strong>.</p>
      ${date ? `<p><strong>Date:</strong> ${date}</p>` : ''}
      <p>Please ensure someone is available at the property during the inspection.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(caseData.customer.email, caseData.customer.name, subject, htmlContent);
  }

  async notifyApproved(caseId: string, approvalNumber: string): Promise<void> {
    const caseData = await this.getCustomerDetails(caseId);
    if (!caseData || !caseData.customer.email) return;

    const subject = `🎉 Congratulations! Your Application is Approved (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${caseData.customer.name},</h3>
      <p>Great news! Your building application for <strong>${caseData.property.address}</strong> has been officially approved.</p>
      <p><strong>Approval Number:</strong> <span style="font-size: 1.2rem; color: #22A06B; font-weight: bold;">${approvalNumber}</span></p>
      <p>You can now log in to download your official approval documents.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(caseData.customer.email, caseData.customer.name, subject, htmlContent);
  }
}
