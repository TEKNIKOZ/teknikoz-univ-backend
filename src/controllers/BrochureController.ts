import { Request, Response } from 'express';
import * as contactRepository from '@/repositories/contactRepository';
import * as brochureRepository from '@/repositories/brochureRequestRepository';
import * as emailService from '@/services/emailService';
import { asyncHandler, createError } from '@/middlewares/errorHandler';
import { logger } from '@/utils/logger';
import { BrochureRequestInput } from '@/schemas/brochureSchema';
import { QueryParamsInput } from '@/schemas/contactSchema';

function getBrochureFileName(courseType: string): string {
  const brochureMap: { [key: string]: string } = {
    'PLM Windchill': 'plm-windchill-brochure.pdf',
    'Siemens Teamcenter': 'siemens-teamcenter-brochure.pdf',
    'Cloud Solutions': 'cloud-solutions-brochure.pdf',
    'Web Development': 'web-development-brochure.pdf',
    'Data Science': 'data-science-brochure.pdf',
    'Mobile Development': 'mobile-development-brochure.pdf',
    'DevOps': 'devops-brochure.pdf',
    'AI/Machine Learning': 'ai-ml-brochure.pdf',
    'Cybersecurity': 'cybersecurity-brochure.pdf',
    'Cloud Computing': 'cloud-computing-brochure.pdf',
    'Other': 'general-brochure.pdf'
  };

  return brochureMap[courseType] || 'general-brochure.pdf';
}

export const requestBrochure = asyncHandler(async (req: Request, res: Response) => {
  const brochureData: BrochureRequestInput = req.body;

  try {
    // Create contact with brochure form type
    const contact = await contactRepository.create({
      ...brochureData,
      form_type: 'brochure'
    });

    // Create brochure request
    const brochureRequest = await brochureRepository.create({
      contact_id: contact.id,
      course_type: brochureData.course_interest,
      brochure_name: getBrochureFileName(brochureData.course_interest)
    });

    // Send brochure email to user
    await emailService.sendBrochureEmail(contact, brochureRequest);

    // Mark email as sent
    await brochureRepository.markEmailSent(brochureRequest.id);

    // Send notification to admin
    await emailService.sendAdminNotification(contact, 'brochure');

    logger.info('Brochure request processed successfully', {
      contactId: contact.id,
      brochureRequestId: brochureRequest.id,
      email: contact.email,
      courseType: brochureData.course_interest
    });

    res.status(201).json({
      success: true,
      message: 'Brochure request submitted successfully. Check your email for the brochure.',
      data: {
        id: brochureRequest.id,
        contact_id: contact.id,
        course_type: brochureRequest.course_type,
        email_sent: true,
        created_at: brochureRequest.created_at
      }
    });
  } catch (error) {
    logger.error('Failed to process brochure request', { error, brochureData });
    throw createError('Failed to submit brochure request', 500);
  }
});

export const getBrochureRequests = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, course_type }: QueryParamsInput = req.query as any;

  try {
    let brochureRequests;

    if (course_type) {
      brochureRequests = await brochureRepository.findByCourseType(course_type, limit);
    } else {
      brochureRequests = await brochureRepository.findAll(limit, offset);
    }

    res.json({
      success: true,
      data: brochureRequests,
      pagination: {
        limit,
        offset,
        total: brochureRequests.length
      }
    });
  } catch (error) {
    logger.error('Failed to fetch brochure requests', { error, query: req.query });
    throw createError('Failed to fetch brochure requests', 500);
  }
});

export const getBrochureRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brochureRequest = await brochureRepository.findById(id);

    if (!brochureRequest) {
      throw createError('Brochure request not found', 404);
    }

    res.json({
      success: true,
      data: brochureRequest
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Brochure request not found') {
      throw error;
    }
    logger.error('Failed to fetch brochure request by ID', { error, brochureRequestId: id });
    throw createError('Failed to fetch brochure request', 500);
  }
});

export const getBrochureRequestsByContact = asyncHandler(async (req: Request, res: Response) => {
  const { contactId } = req.params;

  try {
    const brochureRequests = await brochureRepository.findByContactId(contactId);

    res.json({
      success: true,
      data: brochureRequests
    });
  } catch (error) {
    logger.error('Failed to fetch brochure requests by contact', { error, contactId });
    throw createError('Failed to fetch brochure requests', 500);
  }
});

export const resendBrochure = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brochureRequest = await brochureRepository.findById(id);

    if (!brochureRequest) {
      throw createError('Brochure request not found', 404);
    }

    const contact = await contactRepository.findById(brochureRequest.contact_id);

    if (!contact) {
      throw createError('Contact not found', 404);
    }

    // Resend brochure email
    await emailService.sendBrochureEmail(contact, brochureRequest);

    // Update email sent timestamp
    await brochureRepository.markEmailSent(brochureRequest.id);

    logger.info('Brochure resent successfully', { brochureRequestId: id, contactEmail: contact.email });

    res.json({
      success: true,
      message: 'Brochure resent successfully'
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'Brochure request not found' || error.message === 'Contact not found')) {
      throw error;
    }
    logger.error('Failed to resend brochure', { error, brochureRequestId: id });
    throw createError('Failed to resend brochure', 500);
  }
});

export const getPendingEmailDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query;
  const queryLimit = limit ? parseInt(limit as string) : 50;

  try {
    const pendingRequests = await brochureRepository.findPendingEmailDelivery(queryLimit);

    res.json({
      success: true,
      data: pendingRequests,
      total: pendingRequests.length
    });
  } catch (error) {
    logger.error('Failed to fetch pending email deliveries', { error });
    throw createError('Failed to fetch pending email deliveries', 500);
  }
});

export const getEmailDeliveryStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await brochureRepository.getEmailDeliveryStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Failed to fetch email delivery stats', { error });
    throw createError('Failed to fetch email delivery stats', 500);
  }
});

export const deleteBrochureRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brochureRequest = await brochureRepository.findById(id);

    if (!brochureRequest) {
      throw createError('Brochure request not found', 404);
    }

    await brochureRepository.deleteBrochureRequest(id);

    logger.info('Brochure request deleted successfully', { brochureRequestId: id });

    res.json({
      success: true,
      message: 'Brochure request deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Brochure request not found') {
      throw error;
    }
    logger.error('Failed to delete brochure request', { error, brochureRequestId: id });
    throw createError('Failed to delete brochure request', 500);
  }
});