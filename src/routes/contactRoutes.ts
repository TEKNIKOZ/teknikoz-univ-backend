import express from 'express';
import { ContactController } from '@/controllers/ContactController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import { requireAdmin, optionalAuth } from '@/middlewares/auth';
import { auditMiddleware } from '@/middlewares/audit';
import { 
  contactFormSchema, 
  contactIdSchema, 
  queryParamsSchema 
} from '@/schemas/contactSchemas';

const router = express.Router();
const contactController = new ContactController();

// POST /api/contacts - Create a new contact
router.post('/', 
  optionalAuth,
  auditMiddleware,
  validateRequest(contactFormSchema), 
  contactController.createContact
);

// GET /api/contacts - Get all contacts with optional filtering (Admin only)
router.get('/', 
  requireAdmin,
  validateQuery(queryParamsSchema), 
  contactController.getContacts
);

// GET /api/contacts/:id - Get contact by ID (Admin only)
router.get('/:id', 
  requireAdmin,
  validateParams(contactIdSchema), 
  contactController.getContactById
);

// GET /api/contacts/email/:email - Get contacts by email (Admin only)
router.get('/email/:email', 
  requireAdmin,
  contactController.getContactsByEmail
);

// PUT /api/contacts/:id - Update contact message (Admin only)
router.put('/:id', 
  requireAdmin,
  auditMiddleware,
  validateParams(contactIdSchema), 
  contactController.updateContact
);

// DELETE /api/contacts/:id - Delete contact (Admin only)
router.delete('/:id', 
  requireAdmin,
  validateParams(contactIdSchema), 
  contactController.deleteContact
);

export default router;