import express from 'express';
import { BrochureController } from '@/controllers/BrochureController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import { requireAdmin, optionalAuth } from '@/middlewares/auth';
import { auditMiddleware } from '@/middlewares/audit';
import { 
  brochureRequestSchema, 
  brochureIdSchema, 
  contactIdSchema, 
  queryParamsSchema 
} from '@/schemas/contactSchemas';

const router = express.Router();
const brochureController = new BrochureController();

// POST /api/brochure-requests - Create a new brochure request
router.post('/', 
  optionalAuth,
  auditMiddleware,
  validateRequest(brochureRequestSchema), 
  brochureController.requestBrochure
);

// GET /api/brochure-requests - Get all brochure requests with optional filtering (Admin only)
router.get('/', 
  requireAdmin,
  validateQuery(queryParamsSchema), 
  brochureController.getBrochureRequests
);

// GET /api/brochure-requests/:id - Get brochure request by ID (Admin only)
router.get('/:id', 
  requireAdmin,
  validateParams(brochureIdSchema), 
  brochureController.getBrochureRequestById
);

// GET /api/brochure-requests/contact/:contactId - Get brochure requests by contact ID (Admin only)
router.get('/contact/:contactId', 
  requireAdmin,
  validateParams(contactIdSchema), 
  brochureController.getBrochureRequestsByContact
);

// POST /api/brochure-requests/:id/resend - Resend brochure email (Admin only)
router.post('/:id/resend', 
  requireAdmin,
  validateParams(brochureIdSchema), 
  brochureController.resendBrochure
);

// GET /api/brochure-requests/pending/email-delivery - Get pending email deliveries (Admin only)
router.get('/pending/email-delivery', 
  requireAdmin,
  brochureController.getPendingEmailDeliveries
);

// GET /api/brochure-requests/stats/email-delivery - Get email delivery stats (Admin only)
router.get('/stats/email-delivery', 
  requireAdmin,
  brochureController.getEmailDeliveryStats
);

// DELETE /api/brochure-requests/:id - Delete brochure request (Admin only)
router.delete('/:id', 
  requireAdmin,
  validateParams(brochureIdSchema), 
  brochureController.deleteBrochureRequest
);

export default router;