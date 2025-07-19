import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { isAuth } from '../middlewares/authMiddleware';
import { 
  signupSchema, 
  loginSchema, 
  refreshTokenSchema, 
  revokeTokenSchema 
} from '../schemas/authSchema';
import {
  authRateLimit,
  generalApiRateLimit
} from '../middlewares/rateLimiting';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * @rateLimit 3 requests per hour per IP
 */
router.post('/signup', authRateLimit, validate(signupSchema), authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @rateLimit 10 requests per 15 minutes per IP
 */
router.post('/login', authRateLimit, validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public (requires refresh token in cookie)
 * @rateLimit 100 requests per 15 minutes per IP
 */
router.post('/refresh-token', generalApiRateLimit, validate(refreshTokenSchema), authController.refreshToken);

/**
 * @route   POST /api/auth/revoke-token
 * @desc    Revoke refresh token (logout from specific device)
 * @access  Public (requires refresh token in cookie)
 * @rateLimit 100 requests per 15 minutes per IP
 */
router.post('/revoke-token', generalApiRateLimit, validate(revokeTokenSchema), authController.revokeToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Public (requires refresh token in cookie)
 * @rateLimit 100 requests per 15 minutes per IP
 */
router.post('/logout', generalApiRateLimit, authController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @rateLimit 100 requests per 15 minutes per IP
 */
router.get('/profile', generalApiRateLimit, isAuth, authController.getProfile);

/**
 * @route   POST /api/auth/revoke-all-tokens
 * @desc    Revoke all refresh tokens for user (logout from all devices)
 * @access  Private
 * @rateLimit 10 requests per 15 minutes per IP
 */
router.post('/revoke-all-tokens', authRateLimit, isAuth, authController.revokeAllTokens);

export default router;