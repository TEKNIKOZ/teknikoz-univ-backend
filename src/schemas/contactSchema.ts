import { z } from 'zod';
import { courseOptions } from './constants';

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),

  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .trim(),

  course_interest: z.enum(courseOptions, {
    errorMap: () => ({ message: 'Please select a valid course' })
  }),

  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .trim()
    .optional(),

  form_type: z.enum(['contact', 'brochure'], {
    errorMap: () => ({ message: 'Invalid form type' })
  })
});

export const contactIdSchema = z.object({
  id: z.string().uuid('Invalid contact ID format')
});

export const queryParamsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  form_type: z.enum(['contact', 'brochure']).optional(),
  course_type: z.enum(courseOptions).optional()
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactIdInput = z.infer<typeof contactIdSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;