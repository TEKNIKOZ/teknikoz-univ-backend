import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as authRepository from '../repositories/authRepository';
import { UserData, SignupRequest, LoginRequest, TokenResponse, JwtPayload } from '../types/auth';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || '';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 30; // 30 days

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function signup(userData: SignupRequest): Promise<{ user: UserData; tokens: TokenResponse & { refreshToken: string } }> {
  const emailExists = await authRepository.emailExists(userData.email);
  if (emailExists) {
    throw new Error('Email already exists');
  }

  const usernameExists = await authRepository.usernameExists(userData.username);
  if (usernameExists) {
    throw new Error('Username already exists');
  }

  const userId = await authRepository.createUser(userData);
  
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new Error('Failed to create user');
  }

  const userData_: UserData = {
    id: user.id,
    email: user.email,
    username: user.username,
    is_active: user.is_active,
    is_email_verified: user.is_email_verified,
    roles: user.roles.map(r => r.role.role_name)
  };

  const tokens = await generateTokens(user.id, user.email);

  return { user: userData_, tokens };
}

export async function login(credentials: LoginRequest): Promise<{ user: UserData; tokens: TokenResponse & { refreshToken: string } }> {
  const user = await authRepository.findUserByEmail(credentials.email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('Account is deactivated');
  }

  const userData: UserData = {
    id: user.id,
    email: user.email,
    username: user.username,
    is_active: user.is_active,
    is_email_verified: user.is_email_verified,
    roles: user.roles.map(r => r.role.role_name)
  };

  const tokens = await generateTokens(user.id, user.email);

  return { user: userData, tokens };
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse & { refreshToken: string }> {
  const tokenData = await authRepository.findValidRefreshToken(refreshToken);
  
  if (!tokenData) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await authRepository.findUserById(tokenData.user_id);
  if (!user || !user.is_active) {
    throw new Error('User not found or inactive');
  }

  await authRepository.revokeRefreshToken(refreshToken);

  const tokens = await generateTokens(user.id, user.email);

  return tokens;
}

export async function revokeToken(refreshToken: string): Promise<void> {
  await authRepository.revokeRefreshToken(refreshToken);
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  await authRepository.revokeAllUserTokens(userId);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export async function getUserData(userId: number): Promise<UserData | null> {
  const user = await authRepository.findUserById(userId);
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    is_active: user.is_active,
    is_email_verified: user.is_email_verified,
    roles: user.roles.map(r => r.role.role_name)
  };
}

async function generateTokens(userId: number, email: string): Promise<TokenResponse & { refreshToken: string }> {
  const payload: JwtPayload = {
    id: userId,
    email: email
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  } as jwt.SignOptions);

  const refreshToken = authRepository.generateRefreshToken();
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + REFRESH_TOKEN_EXPIRY);

  await authRepository.storeRefreshToken(userId, refreshToken, refreshTokenExpiry);

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes in seconds
  };
}

export async function cleanupExpiredTokens(): Promise<void> {
  await authRepository.cleanupExpiredTokens();
}