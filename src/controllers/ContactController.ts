import { Request, Response } from 'express';
import * as contactRepository from '@/repositories/contactRepository';
import * as emailService from '@/services/emailService';
import { asyncHandler, createError } from '@/middlewares/errorHandler';
import { logger } from '@/utils/logger';
import { ContactFormInput, QueryParamsInput } from '@/schemas/contactSchema';

export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const contactData: ContactFormInput = req.body;

  try {
    // Create contact in database
    const contact = await contactRepository.create(contactData);

    // Send confirmation email to user
    await emailService.sendContactConfirmation(contact);

    // Send notification to admin
    await emailService.sendAdminNotification(contact, 'contact');

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

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const queryParams = req.query as unknown as QueryParamsInput;
  const { limit = 20, offset = 0, form_type } = queryParams;

  try {
    let contacts;
    if (form_type) {
      contacts = await contactRepository.findByFormType(form_type, parseInt(limit.toString()));
    } else {
      contacts = await contactRepository.findAll(parseInt(limit.toString()), parseInt(offset.toString()));
    }

    logger.info('Contacts retrieved successfully', { count: contacts.length, limit, offset });

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        limit: parseInt(limit.toString()),
        offset: parseInt(offset.toString()),
        total: contacts.length
      }
    });
  } catch (error) {
    logger.error('Failed to fetch contacts', { error, queryParams });
    throw createError('Internal server error during query validation', 500);
  }
});

export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw createError('Contact not found', 404);
    }

    logger.info('Contact retrieved successfully', { contactId: id });

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error('Failed to fetch contact', { error, contactId: id });
    const message = error instanceof Error ? error.message : 'Failed to fetch contact';
    const statusCode = message === 'Contact not found' ? 404 : 500;
    throw createError(message, statusCode);
  }
});

export const getContactsByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const contacts = await contactRepository.findByEmail(email);

    logger.info('Contacts retrieved by email', { email, count: contacts.length });

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    logger.error('Failed to fetch contacts by email', { error, email });
    throw createError('Failed to fetch contacts', 500);
  }
});

export const updateContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    // Check if contact exists
    const existingContact = await contactRepository.findById(id);
    if (!existingContact) {
      throw createError('Contact not found', 404);
    }

    // Update the contact message
    const updatedContact = await contactRepository.updateMessage(id, message);

    logger.info('Contact updated successfully', { contactId: id });

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    });
  } catch (error) {
    logger.error('Failed to update contact', { error, contactId: id });
    const errorMessage = error instanceof Error ? error.message : 'Failed to update contact';
    const statusCode = errorMessage === 'Contact not found' ? 404 : 500;
    throw createError(errorMessage, statusCode);
  }
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if contact exists
    const existingContact = await contactRepository.findById(id);
    if (!existingContact) {
      throw createError('Contact not found', 404);
    }

    // Delete the contact
    await contactRepository.deleteContact(id);

    logger.info('Contact deleted successfully', { contactId: id });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: null
    });
  } catch (error) {
    logger.error('Failed to delete contact', { error, contactId: id });
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
    const statusCode = errorMessage === 'Contact not found' ? 404 : 500;
    throw createError(errorMessage, statusCode);
  }
});