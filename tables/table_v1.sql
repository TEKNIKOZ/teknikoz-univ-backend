-- =================================================================
-- TEKNIKOZ UNIVERSITY - COMPLETE DATABASE SCHEMA v1
-- =================================================================
-- This script creates all required tables for the Teknikoz University system
-- Including: Auth System, Contact Forms, Brochure Requests, and Audit Fields
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- SEQUENCES
-- =================================================================
CREATE SEQUENCE IF NOT EXISTS m_users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS m_roles_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS m_refresh_tokens_id_seq START WITH 1 INCREMENT BY 1;

-- =================================================================
-- AUTHENTICATION SYSTEM TABLES
-- =================================================================

-- Users table
CREATE TABLE IF NOT EXISTS m_users (
    id INT PRIMARY KEY DEFAULT nextval('m_users_id_seq'),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL
);

-- Roles table
CREATE TABLE IF NOT EXISTS m_roles (
    id INT PRIMARY KEY DEFAULT nextval('m_roles_id_seq'),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS m_user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES m_roles(id) ON DELETE CASCADE
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS m_refresh_tokens (
    id INT PRIMARY KEY DEFAULT nextval('m_refresh_tokens_id_seq'),
    user_id INT NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE
);

-- =================================================================
-- APPLICATION TABLES
-- =================================================================

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_interest TEXT NOT NULL,
    message TEXT,
    form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'brochure')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id),
    updated_by INT REFERENCES m_users(id)
);

-- Brochure Requests Table
CREATE TABLE IF NOT EXISTS brochure_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    course_type TEXT NOT NULL,
    brochure_name TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id),
    updated_by INT REFERENCES m_users(id)
);

-- =================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =================================================================

-- Auth system indexes
CREATE INDEX IF NOT EXISTS idx_m_users_email ON m_users(email);
CREATE INDEX IF NOT EXISTS idx_m_users_username ON m_users(username);
CREATE INDEX IF NOT EXISTS idx_m_users_is_active ON m_users(is_active);
CREATE INDEX IF NOT EXISTS idx_m_roles_role_name ON m_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_m_user_roles_user_id ON m_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_m_user_roles_role_id ON m_user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_m_refresh_tokens_user_id ON m_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_m_refresh_tokens_token ON m_refresh_tokens(refresh_token);
CREATE INDEX IF NOT EXISTS idx_m_refresh_tokens_expires_at ON m_refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_m_refresh_tokens_is_revoked ON m_refresh_tokens(is_revoked);

-- Application table indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_form_type ON contacts(form_type);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_contacts_updated_by ON contacts(updated_by);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_contact_id ON brochure_requests(contact_id);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_course_type ON brochure_requests(course_type);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_email_sent ON brochure_requests(email_sent);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_created_by ON brochure_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_updated_by ON brochure_requests(updated_by);

-- =================================================================
-- TRIGGERS FOR AUDIT FIELDS
-- =================================================================

-- Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auth tables
CREATE OR REPLACE TRIGGER update_m_users_updated_at 
    BEFORE UPDATE ON m_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_m_roles_updated_at 
    BEFORE UPDATE ON m_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_m_user_roles_updated_at 
    BEFORE UPDATE ON m_user_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_m_refresh_tokens_updated_at 
    BEFORE UPDATE ON m_refresh_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for application tables
CREATE OR REPLACE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_brochure_requests_updated_at 
    BEFORE UPDATE ON brochure_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- INITIAL DATA SEEDING
-- =================================================================

-- Insert default roles (only admin and user)
INSERT INTO m_roles (role_name, created_at, updated_at) VALUES
('admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (role_name) DO NOTHING;

-- Insert default admin user (password: Admin@123)
-- Password hash for 'Admin@123' using bcrypt
INSERT INTO m_users (username, email, password_hash, is_email_verified, created_at, updated_at)
VALUES ('admin', 'admin@example.com', '$2b$10$9xCHEAvYqsk4Prx1.hGtJenedZJ/6KEqS09nfuvUxh8M.I9mqNcKK', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO m_user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM m_users u, m_roles r
WHERE u.email = 'admin@example.com' AND r.role_name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =================================================================
-- VERIFICATION AND CLEANUP
-- =================================================================

-- Drop old Better-Auth tables if they exist (cleanup)
DROP TABLE IF EXISTS verification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Verification message
DO $$ 
BEGIN 
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'TEKNIKOZ UNIVERSITY DATABASE SCHEMA v1 - SETUP COMPLETED';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables created: m_users, m_roles, m_user_roles, m_refresh_tokens, contacts, brochure_requests';
    RAISE NOTICE 'Default admin user: admin@example.com | password: Admin@123';
    RAISE NOTICE 'Default roles: admin, user';
    RAISE NOTICE 'All indexes, triggers, and constraints applied successfully';
    RAISE NOTICE '=================================================================';
END $$;