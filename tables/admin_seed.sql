-- Admin User Seed Data
-- This script creates the first admin user for the system
-- Run this AFTER running table_v1.sql

-- Insert admin user (you should change the password after first login)
-- The ID should be generated as TEXT, not UUID
INSERT INTO "user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt") 
VALUES (
  'admin-' || uuid_generate_v4()::text,
  'Admin User',
  'admin@teknikoz.com',
  true,
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert account record for email/password authentication
-- This creates a password hash for 'admin123' - CHANGE THIS IN PRODUCTION
INSERT INTO account (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
VALUES (
  'account-' || uuid_generate_v4()::text,
  (SELECT id FROM "user" WHERE email = 'admin@teknikoz.com'),
  'admin@teknikoz.com',
  'credential',
  -- This is bcrypt hash for 'admin123' - CHANGE THIS IN PRODUCTION
  '$2b$10$K7L/T1QmU3.5hJDfpDdZGO4tF1wQVfN8qPZVYRCpQWXrpvXfnfXZW',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Note: The password hash above is for 'admin123'
-- In production, you should:
-- 1. Use Better-Auth's sign-up endpoint to create the admin user
-- 2. Or manually hash a secure password using bcrypt
-- 3. Update the user's role to 'admin' after creation