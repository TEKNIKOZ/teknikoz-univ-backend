import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { AUTH_COOKIES } from '../config/cookies';
import { SignupRequest, LoginRequest } from '../types/auth';
import { asyncHandler, createError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const userData: SignupRequest = req.body;

  try {
    const result = await authService.signup(userData);

    res.cookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      result.tokens.refreshToken,
      AUTH_COOKIES.REFRESH_TOKEN.CONFIG
    );

    logger.info('User signup successful', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn
      }
    });
  } catch (error) {
    logger.error('Failed to signup user', { error, userData: { email: userData.email, username: userData.username } });
    const message = error instanceof Error ? error.message : 'Signup failed';
    throw createError(message, 400);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const credentials: LoginRequest = req.body;

  try {
    const result = await authService.login(credentials);

    res.cookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      result.tokens.refreshToken,
      AUTH_COOKIES.REFRESH_TOKEN.CONFIG
    );

    logger.info('User login successful', {
      userId: result.user.id,
      email: result.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn
      }
    });
  } catch (error) {
    logger.error('Failed to login user', { error, email: credentials.email });
    const message = error instanceof Error ? error.message : 'Login failed';
    throw createError(message, 401);
  }
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN.NAME];
  
  if (!refreshToken) {
    throw createError('Refresh token not found', 401);
  }

  try {
    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      result.refreshToken,
      AUTH_COOKIES.REFRESH_TOKEN.CONFIG
    );

    logger.info('Token refreshed successfully');

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });
  } catch (error) {
    logger.error('Failed to refresh token', { error });
    const message = error instanceof Error ? error.message : 'Token refresh failed';
    throw createError(message, 401);
  }
});

export const revokeToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN.NAME];
  
  if (!refreshToken) {
    throw createError('No refresh token found', 400);
  }

  try {
    await authService.revokeToken(refreshToken);

    res.clearCookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      {
        path: AUTH_COOKIES.REFRESH_TOKEN.CONFIG.path
      }
    );

    logger.info('Token revoked successfully');

    res.status(200).json({
      success: true,
      message: 'Token revoked successfully',
      data: null
    });
  } catch (error) {
    logger.error('Failed to revoke token', { error });
    const message = error instanceof Error ? error.message : 'Token revocation failed';
    throw createError(message, 400);
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN.NAME];
    
    if (refreshToken) {
      await authService.revokeToken(refreshToken);
    }

    res.clearCookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      {
        path: AUTH_COOKIES.REFRESH_TOKEN.CONFIG.path
      }
    );

    logger.info('User logout successful');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      data: null
    });
  } catch (error) {
    logger.error('Failed to logout user', { error });
    const message = error instanceof Error ? error.message : 'Logout failed';
    throw createError(message, 400);
  }
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError('User not authenticated', 401);
  }

  try {
    logger.info('Profile retrieved', { userId: req.user.id, email: req.user.email });

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    logger.error('Failed to get profile', { error, userId: req.user?.id });
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    throw createError(message, 500);
  }
});

export const revokeAllTokens = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError('User not authenticated', 401);
  }

  try {
    await authService.revokeAllUserTokens(req.user.id);

    res.clearCookie(
      AUTH_COOKIES.REFRESH_TOKEN.NAME,
      {
        path: AUTH_COOKIES.REFRESH_TOKEN.CONFIG.path
      }
    );

    logger.info('All tokens revoked successfully', { userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All tokens revoked successfully',
      data: null
    });
  } catch (error) {
    logger.error('Failed to revoke all tokens', { error, userId: req.user.id });
    const message = error instanceof Error ? error.message : 'Failed to revoke all tokens';
    throw createError(message, 500);
  }
});