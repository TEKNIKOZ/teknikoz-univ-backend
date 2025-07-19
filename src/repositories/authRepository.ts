import { pool, executeTransaction } from '../config/database';
import { UserWithRoles, SignupRequest } from '../types/auth';
import { PoolClient } from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
export async function createUser(userData: SignupRequest): Promise<number> {
    return executeTransaction(async (client: PoolClient) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const userResult = await client.query(
        `INSERT INTO m_users (username, email, password_hash, is_email_verified, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [userData.username, userData.email, hashedPassword, userData.is_email_verified || false, userData.is_active || true]
      );

      const userId = userResult.rows[0].id;

      const roleResult = await client.query(
        'SELECT id FROM m_roles WHERE role_name = $1',
        [userData.role || 'user']
      );

      if (roleResult.rows.length === 0) {
        throw new Error(`Role '${userData.role || 'user'}' not found`);
    }

      const roleId = roleResult.rows[0].id;

      await client.query(
        `INSERT INTO m_user_roles (user_id, role_id, created_at, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, roleId]
      );

      return userId;
  });
}

export async function findUserByEmail(email: string): Promise<UserWithRoles | null> {
    const query = `
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.password_hash, 
        u.is_active, 
        u.is_email_verified,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('role', JSON_BUILD_OBJECT('role_name', r.role_name))
          ) FILTER (WHERE r.role_name IS NOT NULL), 
          '[]'
        ) as roles
      FROM m_users u
      LEFT JOIN m_user_roles ur ON u.id = ur.user_id
      LEFT JOIN m_roles r ON ur.role_id = r.id
      WHERE u.email = $1 AND u.is_active = true
      GROUP BY u.id, u.username, u.email, u.password_hash, u.is_active, u.is_email_verified
    `;

    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
  }

    return result.rows[0] as UserWithRoles;
}

export async function findUserById(id: number): Promise<UserWithRoles | null> {
    const query = `
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.password_hash, 
        u.is_active, 
        u.is_email_verified,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('role', JSON_BUILD_OBJECT('role_name', r.role_name))
          ) FILTER (WHERE r.role_name IS NOT NULL), 
          '[]'
        ) as roles
      FROM m_users u
      LEFT JOIN m_user_roles ur ON u.id = ur.user_id
      LEFT JOIN m_roles r ON ur.role_id = r.id
      WHERE u.id = $1 AND u.is_active = true
      GROUP BY u.id, u.username, u.email, u.password_hash, u.is_active, u.is_email_verified
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
  }

    return result.rows[0] as UserWithRoles;
}

export async function emailExists(email: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM m_users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
}

export async function usernameExists(username: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM m_users WHERE username = $1',
      [username]
    );
    return result.rows.length > 0;
}

export async function storeRefreshToken(userId: number, refreshToken: string, expiresAt: Date): Promise<void> {
    await pool.query(
      `INSERT INTO m_refresh_tokens (user_id, refresh_token, expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [userId, refreshToken, expiresAt]
    );
}

export async function findValidRefreshToken(refreshToken: string): Promise<{ user_id: number; id: number } | null> {
    const result = await pool.query(
      `SELECT id, user_id FROM m_refresh_tokens 
       WHERE refresh_token = $1 AND expires_at > CURRENT_TIMESTAMP AND is_revoked = false`,
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return null;
  }

    return result.rows[0];
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
    await pool.query(
      `UPDATE m_refresh_tokens 
       SET is_revoked = true, updated_at = CURRENT_TIMESTAMP 
       WHERE refresh_token = $1`,
      [refreshToken]
    );
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
    await pool.query(
      `UPDATE m_refresh_tokens 
       SET is_revoked = true, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND is_revoked = false`,
      [userId]
    );
}

export async function cleanupExpiredTokens(): Promise<void> {
    await pool.query(
      `DELETE FROM m_refresh_tokens 
       WHERE expires_at <= CURRENT_TIMESTAMP OR is_revoked = true`
    );
}

export function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
}