export interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UserData {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_email_verified: boolean;
  roles: string[];
}

export interface UserWithRoles {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  is_email_verified: boolean;
  roles: Array<{
    role: {
      role_name: string;
    };
  }>;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  role?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}