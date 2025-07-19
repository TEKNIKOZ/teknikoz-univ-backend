import express from 'express';
import { ContactController } from '@/controllers/contactController';
import { validateRequest, validateParams, validateQuery } from '@/middlewares/validation';
import {
  contactFormSchema,
  contactIdSchema,
  queryParamsSchema
} from '@/schemas/contactSchemas';

const router = express.Router();
const contactController = new ContactController();

// POST /api/contacts - Create a new contact
router.post('/',
  validateRequest(contactFormSchema),
  contactController.createContact
);

// GET /api/contacts - Get all contacts with optional filtering
router.get('/',
  validateQuery(queryParamsSchema),
  contactController.getContacts
);

// GET /api/contacts/email/:email - Get contacts by email
router.get('/email/:email',
  contactController.getContactsByEmail
);

// GET /api/contacts/:id - Get contact by ID
router.get('/:id',
  validateParams(contactIdSchema),
  contactController.getContactById
);

// PUT /api/contacts/:id - Update contact message
router.put('/:id',
  validateParams(contactIdSchema),
  contactController.updateContact
);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id',
  validateParams(contactIdSchema),
  contactController.deleteContact
);

export default router;