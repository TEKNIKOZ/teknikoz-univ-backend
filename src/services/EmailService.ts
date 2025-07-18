import { Resend } from 'resend';
import { logger } from '@/utils/logger';
import { Contact, BrochureRequest } from '@/types/database';

export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@teknikoz.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@teknikoz.com';
  }

  async sendContactConfirmation(contact: Contact): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [contact.email],
        subject: 'Thank you for contacting Teknikoz University',
        html: this.getContactConfirmationTemplate(contact)
      });

      if (error) {
        throw new Error(`Failed to send confirmation email: ${error.message}`);
      }

      logger.info(`Contact confirmation email sent to ${contact.email}`, { emailId: data?.id });
    } catch (error) {
      logger.error('Failed to send contact confirmation email', { error, contact: contact.email });
      throw error;
    }
  }

  async sendBrochureEmail(contact: Contact, brochureRequest: BrochureRequest): Promise<void> {
    try {
      const brochureUrl = this.getBrochureUrl(brochureRequest.brochure_name);
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [contact.email],
        subject: `Your ${brochureRequest.course_type} Course Brochure - Teknikoz University`,
        html: this.getBrochureEmailTemplate(contact, brochureRequest),
        attachments: [
          {
            filename: brochureRequest.brochure_name,
            path: brochureUrl
          }
        ]
      });

      if (error) {
        throw new Error(`Failed to send brochure email: ${error.message}`);
      }

      logger.info(`Brochure email sent to ${contact.email}`, { 
        emailId: data?.id,
        courseType: brochureRequest.course_type
      });
    } catch (error) {
      logger.error('Failed to send brochure email', { 
        error, 
        contact: contact.email, 
        courseType: brochureRequest.course_type 
      });
      throw error;
    }
  }

  async sendAdminNotification(contact: Contact, type: 'contact' | 'brochure'): Promise<void> {
    try {
      const subject = type === 'contact' 
        ? 'New Contact Form Submission' 
        : 'New Brochure Request';

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.adminEmail],
        subject: `${subject} - Teknikoz University`,
        html: this.getAdminNotificationTemplate(contact, type)
      });

      if (error) {
        throw new Error(`Failed to send admin notification: ${error.message}`);
      }

      logger.info(`Admin notification sent for ${type} from ${contact.email}`, { emailId: data?.id });
    } catch (error) {
      logger.error('Failed to send admin notification', { error, contact: contact.email, type });
      throw error;
    }
  }

  private getContactConfirmationTemplate(contact: Contact): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Dear ${contact.name},</p>
            <p>Thank you for your interest in <strong>${contact.course_interest}</strong> at Teknikoz University.</p>
            <p>We have received your message and our team will get back to you within 24 hours.</p>
            ${contact.message ? `<p><strong>Your message:</strong><br>${contact.message}</p>` : ''}
            <p>Best regards,<br>The Teknikoz University Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Teknikoz University. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getBrochureEmailTemplate(contact: Contact, brochureRequest: BrochureRequest): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Course Brochure is Ready!</h1>
          </div>
          <div class="content">
            <p>Dear ${contact.name},</p>
            <p>Thank you for your interest in our <strong>${brochureRequest.course_type}</strong> course.</p>
            <p>Please find the course brochure attached to this email. It contains detailed information about:</p>
            <ul>
              <li>Course curriculum and structure</li>
              <li>Learning objectives and outcomes</li>
              <li>Prerequisites and requirements</li>
              <li>Schedule and pricing information</li>
              <li>Career opportunities</li>
            </ul>
            <p>If you have any questions or would like to schedule a consultation, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Teknikoz University Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Teknikoz University. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminNotificationTemplate(contact: Contact, type: 'contact' | 'brochure'): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info-box { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New ${type === 'contact' ? 'Contact' : 'Brochure'} Submission</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <strong>Name:</strong> ${contact.name}<br>
              <strong>Email:</strong> ${contact.email}<br>
              <strong>Phone:</strong> ${contact.phone}<br>
              <strong>Course Interest:</strong> ${contact.course_interest}<br>
              <strong>Form Type:</strong> ${contact.form_type}<br>
              <strong>Submitted At:</strong> ${new Date(contact.created_at).toLocaleString()}
            </div>
            ${contact.message ? `<div class="info-box"><strong>Message:</strong><br>${contact.message}</div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getBrochureUrl(brochureName: string): string {
    // This would typically be a Supabase Storage URL
    // For now, we'll use a placeholder
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/brochures/${brochureName}`;
  }
}