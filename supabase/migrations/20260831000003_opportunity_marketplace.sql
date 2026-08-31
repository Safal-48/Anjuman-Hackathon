-- ==============================================================================
-- TECH-TITAN (SIH 2026 - Problem Statement 26044)
-- Opportunity Marketplace, Applications & Notification System Migration
-- ==============================================================================

-- 1. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    opportunity_type VARCHAR(64) NOT NULL CHECK (opportunity_type IN (
        'internship', 'job', 'industry_project', 'apprenticeship', 'training_program', 'workshop', 'mentorship'
    )),
    description TEXT NOT NULL,
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    preferred_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility TEXT NOT NULL,
    min_gpa NUMERIC(4, 2),
    experience_required VARCHAR(64) DEFAULT 'Freshers eligible',
    location VARCHAR(128) NOT NULL,
    location_type VARCHAR(32) DEFAULT 'hybrid' CHECK (location_type IN ('remote', 'hybrid', 'onsite')),
    stipend_salary VARCHAR(128) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    deadline DATE NOT NULL,
    openings_count INTEGER DEFAULT 1 CHECK (openings_count > 0),
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opportunities_creator ON public.opportunities(creator_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);

-- 2. OPPORTUNITY APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'applied' CHECK (status IN (
        'applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'
    )),
    cover_note TEXT,
    match_score NUMERIC(5, 2) NOT NULL DEFAULT 75.0,
    match_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_student_opportunity UNIQUE (opportunity_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_student ON public.opportunity_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.opportunity_applications(status);

-- 3. USER NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) DEFAULT 'application_status' CHECK (type IN (
        'application_status', 'opportunity_match', 'recruiter_action', 'system'
    )),
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.user_notifications(user_id, is_read);

-- RLS POLICIES
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Industry users can manage own opportunities" ON public.opportunities FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Students can view and create own applications" ON public.opportunity_applications FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Recruiters can view applications to their opportunities" ON public.opportunity_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.opportunities WHERE opportunities.id = opportunity_applications.opportunity_id AND opportunities.creator_id = auth.uid())
);
CREATE POLICY "Recruiters can update status of applications to their opportunities" ON public.opportunity_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.opportunities WHERE opportunities.id = opportunity_applications.opportunity_id AND opportunities.creator_id = auth.uid())
);

CREATE POLICY "Users can view and manage own notifications" ON public.user_notifications FOR ALL USING (auth.uid() = user_id);
