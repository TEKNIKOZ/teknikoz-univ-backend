import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    role: z.string().optional().default('user'),
    is_active: z.boolean().optional().default(true),
    is_email_verified: z.boolean().optional().default(false)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().optional()
  }).optional()
});

export const revokeTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().optional()
  }).optional()
});