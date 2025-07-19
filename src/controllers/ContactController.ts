import { Request, Response } from 'express';
import { ContactRepository } from '@/repositories/contactRepository';
import { EmailService } from '@/services/EmailService';
import { asyncHandler, createError } from '@/middlewares/errorHandler';
import { logger } from '@/utils/logger';
import { ContactFormInput, QueryParamsInput } from '@/schemas/contactSchemas';

export class ContactController {
  private contactRepository: ContactRepository;
  private emailService: EmailService;

  constructor() {
    this.contactRepository = new ContactRepository();
    this.emailService = new EmailService();
  }

  createContact = asyncHandler(async (req: Request, res: Response) => {
    const contactData: ContactFormInput = req.body;

    try {
      // Create contact in database
      const contact = await this.contactRepository.create(contactData);

      // Send confirmation email to user
      await this.emailService.sendContactConfirmation(contact);

      // Send notification to admin
      await this.emailService.sendAdminNotification(contact, 'contact');

      logger.info('Contact form submitted successfully', {
        contactId: contact.id,
        email: contact.email,
        courseInterest: contact.course_interest
      });

      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          course_interest: contact.course_interest,
          created_at: contact.created_at
        }
      });
    } catch (error) {
      logger.error('Failed to process contact form', { error, contactData });
      throw createError('Failed to submit contact form', 500);
    }
  });

  getContacts = asyncHandler(async (req: Request, res: Response) => {
    const { limit, offset, form_type }: QueryParamsInput = req.query as any;

    try {
      let contacts;

      if (form_type) {
        contacts = await this.contactRepository.findByFormType(form_type, limit);
      } else {
        contacts = await this.contactRepository.findAll(limit, offset);
      }

      res.json({
        success: true,
        data: contacts,
        pagination: {
          limit,
          offset,
          total: contacts.length
        }
      });
    } catch (error) {
      logger.error('Failed to fetch contacts', { error, query: req.query });
      throw createError('Failed to fetch contacts', 500);
    }
  });

  getContactById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const contact = await this.contactRepository.findById(id);

      if (!contact) {
        throw createError('Contact not found', 404);
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact not found') {
        throw error;
      }
      logger.error('Failed to fetch contact by ID', { error, contactId: id });
      throw createError('Failed to fetch contact', 500);
    }
  });

  getContactsByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;

    try {
      const contacts = await this.contactRepository.findByEmail(email);

      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      logger.error('Failed to fetch contacts by email', { error, email });
      throw createError('Failed to fetch contacts', 500);
    }
  });

  updateContact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      throw createError('Message is required and must be a string', 400);
    }

    try {
      const contact = await this.contactRepository.findById(id);

      if (!contact) {
        throw createError('Contact not found', 404);
      }

      const updatedContact = await this.contactRepository.updateMessage(id, message);

      logger.info('Contact updated successfully', { contactId: id });

      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: updatedContact
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact not found') {
        throw error;
      }
      logger.error('Failed to update contact', { error, contactId: id });
      throw createError('Failed to update contact', 500);
    }
  });

  deleteContact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const contact = await this.contactRepository.findById(id);

      if (!contact) {
        throw createError('Contact not found', 404);
      }

      await this.contactRepository.delete(id);

      logger.info('Contact deleted successfully', { contactId: id });

      res.json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact not found') {
        throw error;
      }
      logger.error('Failed to delete contact', { error, contactId: id });
      throw createError('Failed to delete contact', 500);
    }
  });
}