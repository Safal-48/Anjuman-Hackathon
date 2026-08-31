-- ==============================================================================
-- TECH-TITAN (SIH 2026 - Problem Statement 26044)
-- Skill Intelligence & Assessment Schema Migration
-- Standardized Assessment Question Bank, Session Persistence, & Gap Calculation
-- ==============================================================================

-- 1. ASSESSMENT QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(32) NOT NULL CHECK (category IN ('technical', 'soft_skill', 'aptitude', 'career_interest')),
    skill_tag VARCHAR(128) NOT NULL,
    difficulty VARCHAR(32) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_text TEXT NOT NULL,
    question_type VARCHAR(32) DEFAULT 'single_choice' CHECK (question_type IN ('single_choice', 'multiple_choice', 'likert_scale')),
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    explanation TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON public.assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_skill_tag ON public.assessment_questions(skill_tag);

-- 2. TARGET ROLES & BENCHMARKS TABLE
CREATE TABLE IF NOT EXISTS public.target_roles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    required_readiness_score INTEGER DEFAULT 80 CHECK (required_readiness_score BETWEEN 0 AND 100),
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed Target Industry Roles
INSERT INTO public.target_roles (id, title, description, required_readiness_score, required_skills) VALUES
('ai_systems_engineer', 'AI Systems & LLM Platform Engineer', 'Designs high-throughput distributed neural network architectures, TensorRT optimization pipelines, and scalable LLM orchestration.', 85, '[
  {"skillName": "Python & PyTorch", "category": "AI & Machine Learning", "requiredScore": 90, "weight": 1.5},
  {"skillName": "Distributed Systems", "category": "Cloud & DevOps", "requiredScore": 85, "weight": 1.3},
  {"skillName": "React / Next.js", "category": "Web Systems", "requiredScore": 75, "weight": 0.8},
  {"skillName": "Algorithms & Complexity", "category": "Core Aptitude", "requiredScore": 85, "weight": 1.2},
  {"skillName": "System Architecture", "category": "Technical Architecture", "requiredScore": 90, "weight": 1.4},
  {"skillName": "Problem Solving", "category": "Cognitive Aptitude", "requiredScore": 85, "weight": 1.0},
  {"skillName": "Team Collaboration", "category": "Soft Skills", "requiredScore": 80, "weight": 0.9},
  {"skillName": "Communication & Mentorship", "category": "Soft Skills", "requiredScore": 75, "weight": 0.8}
]'::jsonb),
('full_stack_architect', 'Full-Stack Cloud Architect', 'Architects end-to-end mission-critical SaaS applications, microservices, and reactive frontend experiences.', 82, '[
  {"skillName": "React / Next.js", "category": "Web Systems", "requiredScore": 95, "weight": 1.5},
  {"skillName": "TypeScript", "category": "Web Systems", "requiredScore": 90, "weight": 1.4},
  {"skillName": "Distributed Systems", "category": "Cloud & DevOps", "requiredScore": 85, "weight": 1.2},
  {"skillName": "System Architecture", "category": "Technical Architecture", "requiredScore": 88, "weight": 1.3},
  {"skillName": "Algorithms & Complexity", "category": "Core Aptitude", "requiredScore": 80, "weight": 1.0},
  {"skillName": "Problem Solving", "category": "Cognitive Aptitude", "requiredScore": 80, "weight": 1.0},
  {"skillName": "Team Collaboration", "category": "Soft Skills", "requiredScore": 85, "weight": 1.0},
  {"skillName": "Communication & Mentorship", "category": "Soft Skills", "requiredScore": 80, "weight": 0.9}
]'::jsonb),
('cloud_devops_sre', 'Cloud DevOps & Reliability Engineer (SRE)', 'Builds automated CI/CD pipelines, container orchestration meshes, and high-availability infrastructure.', 80, '[
  {"skillName": "Distributed Systems", "category": "Cloud & DevOps", "requiredScore": 92, "weight": 1.5},
  {"skillName": "System Architecture", "category": "Technical Architecture", "requiredScore": 85, "weight": 1.3},
  {"skillName": "Algorithms & Complexity", "category": "Core Aptitude", "requiredScore": 75, "weight": 1.0},
  {"skillName": "Problem Solving", "category": "Cognitive Aptitude", "requiredScore": 85, "weight": 1.1},
  {"skillName": "Team Collaboration", "category": "Soft Skills", "requiredScore": 80, "weight": 0.9},
  {"skillName": "Communication & Mentorship", "category": "Soft Skills", "requiredScore": 75, "weight": 0.8}
]'::jsonb),
('cybersecurity_specialist', 'Cybersecurity & Cryptography Specialist', 'Secures distributed protocols, performs vulnerability analysis, and reinforces cryptographic identity layers.', 84, '[
  {"skillName": "Distributed Systems", "category": "Cloud & DevOps", "requiredScore": 88, "weight": 1.3},
  {"skillName": "System Architecture", "category": "Technical Architecture", "requiredScore": 90, "weight": 1.4},
  {"skillName": "Algorithms & Complexity", "category": "Core Aptitude", "requiredScore": 90, "weight": 1.4},
  {"skillName": "Problem Solving", "category": "Cognitive Aptitude", "requiredScore": 90, "weight": 1.2},
  {"skillName": "Team Collaboration", "category": "Soft Skills", "requiredScore": 75, "weight": 0.8}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. ASSESSMENT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    current_question_index INTEGER DEFAULT 0,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.assessment_sessions(status);

-- 4. STUDENT SKILL EVALUATIONS & GAP REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.student_skill_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
    overall_readiness_score NUMERIC(5, 2) NOT NULL CHECK (overall_readiness_score BETWEEN 0 AND 100),
    technical_score NUMERIC(5, 2) NOT NULL CHECK (technical_score BETWEEN 0 AND 100),
    soft_skill_score NUMERIC(5, 2) NOT NULL CHECK (soft_skill_score BETWEEN 0 AND 100),
    aptitude_score NUMERIC(5, 2) NOT NULL CHECK (aptitude_score BETWEEN 0 AND 100),
    career_alignment_score NUMERIC(5, 2) DEFAULT 80 CHECK (career_alignment_score BETWEEN 0 AND 100),
    skill_breakdowns JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_role_id VARCHAR(64) REFERENCES public.target_roles(id) ON DELETE SET NULL,
    skill_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evaluations_user ON public.student_skill_evaluations(user_id);

-- RLS POLICIES
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for questions" ON public.assessment_questions FOR SELECT USING (true);
CREATE POLICY "Public read for target roles" ON public.target_roles FOR SELECT USING (true);

CREATE POLICY "Users can manage own assessment sessions" ON public.assessment_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view and manage own evaluations" ON public.student_skill_evaluations FOR ALL USING (auth.uid() = user_id);
