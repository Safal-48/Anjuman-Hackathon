-- ==============================================================================
-- TECH-TITAN (SIH 2026 - Problem Statement 26044)
-- Core Database Schema Migration
-- Normalized PostgreSQL Schema for Identity, Roles, Skills, Projects, & Profiles
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed static roles
INSERT INTO public.roles (id, name, description) VALUES
('student', 'Student', 'Learner and candidate profile in tech and engineering disciplines'),
('industry', 'Industry', 'Recruiter and enterprise organization seeking verified talent'),
('academician', 'Academician', 'Faculty and research mentor in academic institutions'),
('institution', 'Institution', 'Higher education institution, college, or university entity'),
('admin', 'Administrator', 'Platform security and system governance authority')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(32),
    location VARCHAR(128),
    role VARCHAR(32) NOT NULL REFERENCES public.roles(id) ON UPDATE CASCADE,
    is_onboarded BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 3. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    education VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    academic_year VARCHAR(64) NOT NULL,
    gpa NUMERIC(4, 2),
    career_goal TEXT,
    experience_summary TEXT,
    readiness_score INTEGER DEFAULT 75 CHECK (readiness_score BETWEEN 0 AND 100),
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. INDUSTRY PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.industry_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    industry_domain VARCHAR(128) NOT NULL,
    organization_size VARCHAR(64) NOT NULL,
    organization_description TEXT,
    website TEXT,
    recruiter_name VARCHAR(255) NOT NULL,
    recruiter_designation VARCHAR(128) NOT NULL,
    recruiter_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. ACADEMICIAN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.academician_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    designation VARCHAR(128) NOT NULL,
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    scholar_profile TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. INSTITUTION PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.institution_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(64) NOT NULL CHECK (institution_type IN ('university', 'autonomous_college', 'affiliated_college', 'research_institute', 'other')),
    registration_code VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    representative_name VARCHAR(255) NOT NULL,
    representative_designation VARCHAR(128) NOT NULL,
    representative_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. SKILL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    icon VARCHAR(64) DEFAULT 'Code',
    display_order INTEGER DEFAULT 0
);

INSERT INTO public.skill_categories (id, name, icon, display_order) VALUES
('ai_ml', 'AI & Machine Learning', 'Brain', 1),
('web_sys', 'Distributed & Web Systems', 'Globe', 2),
('cloud_devops', 'Cloud & DevOps', 'Cloud', 3),
('cybersecurity', 'Cybersecurity & Cryptography', 'Shield', 4),
('hardware_iot', 'Robotics, Embedded & IoT', 'Cpu', 5),
('data_analytics', 'Data Science & Analytics', 'Database', 6)
ON CONFLICT (id) DO NOTHING;

-- 8. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(128) NOT NULL UNIQUE,
    category_id VARCHAR(64) REFERENCES public.skill_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category_id);

-- 9. STUDENT SKILLS (Many-to-Many with Proficiency)
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    skill_name VARCHAR(128) NOT NULL,
    level VARCHAR(32) DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    proficiency_score INTEGER DEFAULT 75 CHECK (proficiency_score BETWEEN 1 AND 100),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_student_skill UNIQUE (student_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_student_skills_student ON public.student_skills(student_id);

-- 10. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    repo_url TEXT,
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

-- 11. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(128),
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_certifications_user ON public.certifications(user_id);

-- 12. ACHIEVEMENTS & AWARDS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'award' CHECK (category IN ('hackathon', 'award', 'publication', 'competition', 'patent', 'other')),
    description TEXT,
    date_achieved DATE,
    proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);

-- 13. DOCUMENTS TABLE (Resume / Portfolio / Official Transcripts)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(64) DEFAULT 'resume' CHECK (type IN ('resume', 'certificate', 'transcript', 'portfolio_doc', 'other')),
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for verified profile discovery
CREATE POLICY "Public users can view profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public users can view student profiles" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Public users can view industry profiles" ON public.industry_profiles FOR SELECT USING (true);
CREATE POLICY "Public users can view academician profiles" ON public.academician_profiles FOR SELECT USING (true);
CREATE POLICY "Public users can view institution profiles" ON public.institution_profiles FOR SELECT USING (true);
CREATE POLICY "Public users can view student skills" ON public.student_skills FOR SELECT USING (true);
CREATE POLICY "Public users can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public users can view certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public users can view achievements" ON public.achievements FOR SELECT USING (true);

-- 2. Owner Write/Mutation Policies (Users can only modify their own data)
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can update own student profile" ON public.student_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can update own industry profile" ON public.industry_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can update own academician profile" ON public.academician_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can update own institution profile" ON public.institution_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skills" ON public.student_skills FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Users can manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own certifications" ON public.certifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
