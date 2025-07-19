import express from 'express';
import * as brochureController from '@/controllers/brochureController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import { brochureRequestSchema, brochureIdSchema } from '@/schemas/brochureSchema';
import { contactIdSchema, queryParamsSchema } from '@/schemas/contactSchema';
import {
  brochureRequestRateLimit,
  generalApiRateLimit,
  adminRateLimit
} from '@/middlewares/rateLimiting';

const router = express.Router();

// POST /api/brochure-requests - Create a new brochure request (rate limited)
router.post('/',
  brochureRequestRateLimit,
  validateRequest(brochureRequestSchema),
  brochureController.requestBrochure
);

// GET /api/brochure-requests - Get all brochure requests with optional filtering (admin)
router.get('/',
  adminRateLimit,
  validateQuery(queryParamsSchema),
  brochureController.getBrochureRequests
);

// GET /api/brochure-requests/pending/email-delivery - Get pending email deliveries (admin)
router.get('/pending/email-delivery',
  adminRateLimit,
  brochureController.getPendingEmailDeliveries
);

// GET /api/brochure-requests/stats/email-delivery - Get email delivery stats (admin)
router.get('/stats/email-delivery',
  adminRateLimit,
  brochureController.getEmailDeliveryStats
);

// GET /api/brochure-requests/contact/:contactId - Get brochure requests by contact ID (general)
router.get('/contact/:contactId',
  generalApiRateLimit,
  validateParams(contactIdSchema),
  brochureController.getBrochureRequestsByContact
);

// GET /api/brochure-requests/:id - Get brochure request by ID (general)
router.get('/:id',
  generalApiRateLimit,
  validateParams(brochureIdSchema),
  brochureController.getBrochureRequestById
);

// POST /api/brochure-requests/:id/resend - Resend brochure email (admin)
router.post('/:id/resend',
  adminRateLimit,
  validateParams(brochureIdSchema),
  brochureController.resendBrochure
);

// DELETE /api/brochure-requests/:id - Delete brochure request (admin)
router.delete('/:id',
  adminRateLimit,
  validateParams(brochureIdSchema),
  brochureController.deleteBrochureRequest
);

export default router;