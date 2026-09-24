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
        property: true
      }
    });

    if (!caseData || !caseData.property) return null;

    // Look up the customer User by the property's owner_phone
    const customer = await prisma.user.findUnique({
      where: { phone: caseData.property.owner_phone }
    });

    return { caseData, customer };
  }

  async notifyStatusChange(caseId: string, oldStatus: CaseStatus, newStatus: CaseStatus): Promise<void> {
    const result = await this.getCustomerDetails(caseId);
    if (!result || !result.customer || !result.customer.email) return;

    const { caseData, customer } = result;

    const subject = `Update on your Building Application (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${customer.name},</h3>
      <p>The status of your building application at <strong>${caseData.property.address}</strong> has changed.</p>
      <p><strong>Old Status:</strong> ${oldStatus.replace(/_/g, ' ')}<br/>
      <strong>New Status:</strong> <span style="color: #0B63CE; font-weight: bold;">${newStatus.replace(/_/g, ' ')}</span></p>
      <p>You can track the progress of your application by logging into your dashboard.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(customer.email, customer.name, subject, htmlContent);
  }

  async notifyInspectionScheduled(caseId: string, date?: string): Promise<void> {
    const result = await this.getCustomerDetails(caseId);
    if (!result || !result.customer || !result.customer.email) return;

    const { caseData, customer } = result;

    const subject = `Inspection Scheduled - Application (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${customer.name},</h3>
      <p>An inspection has been scheduled for your property at <strong>${caseData.property.address}</strong>.</p>
      ${date ? `<p><strong>Date:</strong> ${date}</p>` : ''}
      <p>Please ensure someone is available at the property during the inspection.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(customer.email, customer.name, subject, htmlContent);
  }

  async notifyApproved(caseId: string, approvalNumber: string): Promise<void> {
    const result = await this.getCustomerDetails(caseId);
    if (!result || !result.customer || !result.customer.email) return;

    const { caseData, customer } = result;

    const subject = `🎉 Congratulations! Your Application is Approved (${caseId.substring(0,8)})`;
    const htmlContent = `
      <h3>Hello ${customer.name},</h3>
      <p>Great news! Your building application for <strong>${caseData.property.address}</strong> has been officially approved.</p>
      <p><strong>Approval Number:</strong> <span style="font-size: 1.2rem; color: #22A06B; font-weight: bold;">${approvalNumber}</span></p>
      <p>You can now log in to download your official approval documents.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;

    await this.sendEmail(customer.email, customer.name, subject, htmlContent);
  }

  async notifyLeadThanks(email: string, name: string): Promise<void> {
    const subject = `Thank you for applying with Build Approval ERP`;
    const htmlContent = `
      <h3>Hello ${name},</h3>
      <p>Thank you for submitting your building approval application!</p>
      <p>Our team has successfully received your details and will get in touch with you shortly to assist you further.</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;
    await this.sendEmail(email, name, subject, htmlContent);
  }

  async notifyUploadLink(email: string, name: string, uploadLink: string): Promise<void> {
    const subject = `Document Upload Required - Build Approval ERP`;
    const htmlContent = `
      <h3>Hello ${name},</h3>
      <p>We need some additional documents to process your building application.</p>
      <p>Please click the link below to securely upload your documents:</p>
      <p><a href="${uploadLink}" style="display:inline-block;padding:10px 20px;background-color:#0B63CE;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">Upload Documents</a></p>
      <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
      <p>${uploadLink}</p>
      <br/>
      <p>Best regards,<br/>Build Approval ERP Team</p>
    `;
    await this.sendEmail(email, name, subject, htmlContent);
  }
}
