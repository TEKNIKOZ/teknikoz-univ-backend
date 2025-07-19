import rateLimit from 'express-rate-limit';

// Standard error message
const rateLimitMessage = {
  success: false,
  message: 'Too many requests, please try again later',
  data: null
};

// Contact form rate limiting - strict to prevent spam
export const contactFormRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 contact form submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again after 1 hour',
    data: null
  }
});

// Brochure request rate limiting - moderate
export const brochureRequestRateLimit = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Limit each IP to 5 brochure requests per 30 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many brochure requests, please try again after 30 minutes',
    data: null
  }
});

// General API rate limiting for read operations
export const generalApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage
});

// Admin operations rate limiting
export const adminRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // Limit each IP to 200 admin requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage
});

// Auth rate limiting (simplified version)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
    data: null
  }
});