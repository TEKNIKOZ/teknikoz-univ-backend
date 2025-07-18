-- Teknikoz University Database Schema
-- Contact Form & Email System + Better-Auth Tables

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BETTER-AUTH REQUIRED TABLES
-- =============================================

-- User Table (Better-Auth - singular as expected by Better-Auth)
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" BOOLEAN DEFAULT FALSE,
    image TEXT,
    role TEXT DEFAULT 'user',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session Table (Better-Auth - singular as expected by Better-Auth)
CREATE TABLE session (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Account Table (Better-Auth - singular as expected by Better-Auth)
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
    "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    "idToken" TEXT,
    password TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification Table (Better-Auth - singular as expected by Better-Auth)
CREATE TABLE verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- APPLICATION TABLES
-- =============================================

-- Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_interest TEXT NOT NULL,
    message TEXT,
    form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'brochure')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES "user"(id),
    updated_by TEXT REFERENCES "user"(id)
);

-- Brochure Requests Table
CREATE TABLE brochure_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    course_type TEXT NOT NULL,
    brochure_name TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES "user"(id),
    updated_by TEXT REFERENCES "user"(id)
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Better-Auth table indexes
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_session_userId ON session("userId");
CREATE INDEX idx_session_token ON session(token);
CREATE INDEX idx_session_expiresAt ON session("expiresAt");
CREATE INDEX idx_account_userId ON account("userId");
CREATE INDEX idx_account_providerId ON account("providerId");
CREATE INDEX idx_verification_identifier ON verification(identifier);
CREATE INDEX idx_verification_expiresAt ON verification("expiresAt");

-- Application table indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_contacts_form_type ON contacts(form_type);
CREATE INDEX idx_contacts_created_by ON contacts(created_by);
CREATE INDEX idx_contacts_updated_by ON contacts(updated_by);
CREATE INDEX idx_brochure_requests_contact_id ON brochure_requests(contact_id);
CREATE INDEX idx_brochure_requests_course_type ON brochure_requests(course_type);
CREATE INDEX idx_brochure_requests_email_sent ON brochure_requests(email_sent);
CREATE INDEX idx_brochure_requests_created_by ON brochure_requests(created_by);
CREATE INDEX idx_brochure_requests_updated_by ON brochure_requests(updated_by);

-- =============================================
-- TRIGGERS FOR AUDIT FIELDS
-- =============================================

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for contacts table
CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for brochure_requests table
CREATE TRIGGER update_brochure_requests_updated_at 
    BEFORE UPDATE ON brochure_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();