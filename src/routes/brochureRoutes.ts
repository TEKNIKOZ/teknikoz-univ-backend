import express from 'express';
import { BrochureRequestController } from '@/controllers/brochureController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import {
  brochureRequestSchema,
  brochureIdSchema,
  contactIdSchema,
  queryParamsSchema
} from '@/schemas/contactSchemas';

const router = express.Router();
const brochureRequestController = new BrochureRequestController();

// POST /api/brochure-requests - Create a new brochure request
router.post('/',
  validateRequest(brochureRequestSchema),
  brochureRequestController.requestBrochure
);

// GET /api/brochure-requests - Get all brochure requests with optional filtering
router.get('/',
  validateQuery(queryParamsSchema),
  brochureRequestController.getBrochureRequests
);

// GET /api/brochure-requests/pending/email-delivery - Get pending email deliveries
router.get('/pending/email-delivery',
  brochureRequestController.getPendingEmailDeliveries
);

// GET /api/brochure-requests/stats/email-delivery - Get email delivery stats
router.get('/stats/email-delivery',
  brochureRequestController.getEmailDeliveryStats
);

// GET /api/brochure-requests/contact/:contactId - Get brochure requests by contact ID
router.get('/contact/:contactId',
  validateParams(contactIdSchema),
  brochureRequestController.getBrochureRequestsByContact
);

// GET /api/brochure-requests/:id - Get brochure request by ID
router.get('/:id',
  validateParams(brochureIdSchema),
  brochureRequestController.getBrochureRequestById
);

// POST /api/brochure-requests/:id/resend - Resend brochure email
router.post('/:id/resend',
  validateParams(brochureIdSchema),
  brochureRequestController.resendBrochure
);

// DELETE /api/brochure-requests/:id - Delete brochure request
router.delete('/:id',
  validateParams(brochureIdSchema),
  brochureRequestController.deleteBrochureRequest
);

export default router;