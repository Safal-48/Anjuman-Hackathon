-- ============================================================================
-- TECH-TITAN: Employability Layer, Verified Digital Portfolio & Mentorship Schema
-- Problem Statement #26044 (Smart India Hackathon 2026)
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Student Internships
CREATE TABLE IF NOT EXISTS public.student_internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb,
    proof_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verifier_institution VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Credential Verifications (Tamper-evident verification ledger)
CREATE TABLE IF NOT EXISTS public.credential_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credential_type VARCHAR(50) NOT NULL CHECK (credential_type IN ('skill', 'project', 'certification', 'internship', 'achievement', 'document')),
    credential_id VARCHAR(255) NOT NULL,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    verifier_role VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'rejected')),
    verification_badge VARCHAR(100) NOT NULL DEFAULT 'Institution Verified',
    verification_hash VARCHAR(255) NOT NULL,
    verifier_notes TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mentorship Profiles
CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_name VARCHAR(255) NOT NULL,
    current_title VARCHAR(255) NOT NULL,
    company_or_institution VARCHAR(255) NOT NULL,
    expertise_areas JSONB DEFAULT '[]'::jsonb,
    years_of_experience INTEGER NOT NULL DEFAULT 5,
    bio TEXT NOT NULL,
    hourly_rate_or_free VARCHAR(100) NOT NULL DEFAULT 'Free / Pro Bono',
    available_slots JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    total_sessions_conducted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mentorship Sessions & Requests
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    goal_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'scheduled', 'in_progress', 'completed', 'rejected')),
    scheduled_at TIMESTAMPTZ,
    meeting_link TEXT,
    mentor_notes TEXT,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for Fast Access
CREATE INDEX IF NOT EXISTS idx_student_internships_student ON public.student_internships(student_id);
CREATE INDEX IF NOT EXISTS idx_credential_verifications_student ON public.credential_verifications(student_id);
CREATE INDEX IF NOT EXISTS idx_credential_verifications_type ON public.credential_verifications(credential_type, credential_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_profiles_user ON public.mentorship_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_student ON public.mentorship_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentor ON public.mentorship_sessions(mentor_id);
