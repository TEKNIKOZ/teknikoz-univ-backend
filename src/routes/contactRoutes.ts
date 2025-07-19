import express from 'express';
import * as contactController from '@/controllers/contactController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import {
  contactFormSchema,
  contactIdSchema,
  queryParamsSchema
} from '@/schemas/contactSchema';
import {
  contactFormRateLimit,
  generalApiRateLimit,
  adminRateLimit
} from '@/middlewares/rateLimiting';

const router = express.Router();

// POST /api/contacts - Create a new contact (rate limited to prevent spam)
router.post('/',
  contactFormRateLimit,
  validateRequest(contactFormSchema),
  contactController.createContact
);

// GET /api/contacts - Get all contacts with optional filtering (admin operation)
router.get('/',
  adminRateLimit,
  validateQuery(queryParamsSchema),
  contactController.getContacts
);

// GET /api/contacts/email/:email - Get contacts by email (admin operation)
router.get('/email/:email',
  adminRateLimit,
  contactController.getContactsByEmail
);

// GET /api/contacts/:id - Get contact by ID (general API access)
router.get('/:id',
  generalApiRateLimit,
  validateParams(contactIdSchema),
  contactController.getContactById
);

// PUT /api/contacts/:id - Update contact message (admin operation)
router.put('/:id',
  adminRateLimit,
  validateParams(contactIdSchema),
  contactController.updateContact
);

// DELETE /api/contacts/:id - Delete contact (admin operation)
router.delete('/:id',
  adminRateLimit,
  validateParams(contactIdSchema),
  contactController.deleteContact
);

export default router;