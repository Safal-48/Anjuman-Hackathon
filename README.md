# TECH-TITAN (Smart India Hackathon 2026 - Problem Statement #26044)

> **Autonomous Skill Intelligence, AI Career Navigation, Opportunity Marketplace & Verified Digital Portfolio Platform**

Built for **Smart India Hackathon 2026** based on **Problem Statement #26044**.

---

## 🏛️ Final Architecture Summary

TECH-TITAN is an enterprise-grade platform engineered to bridge the critical gap between academic learning and industry employability through real-time skill intelligence, explainable candidate matching, contextual AI guidance, and cryptographic credential verification.

- **Frontend & App Core**: Next.js 14 (App Router) with React Server Components (RSC) & Streaming SSR.
- **Type Safety**: 100% Strict TypeScript with zero `any` leaks and Zod runtime schema validation.
- **Design System & Aesthetics**: Dark-first Cyberpunk/Obsidian theme with HSL variables, glassmorphic depth, CVA component variants, and Framer Motion micro-interactions.
- **3D Visualization Layer**: React Three Fiber & Three.js with lazy-loaded dynamic imports and hardware fallback.
- **Database & Data Layer**: Supabase PostgreSQL schema with relational tables, foreign keys, timestamps, indexes, and full TypeScript typing.
- **Deterministic & Explainable AI**: Multi-vector skill gap calculation, non-fabricating resume analysis, 4-phase milestone roadmaps, explainable match decomposition (Strong ✓, Partial ⚠, Gap ✗), and 4-vector AI mock interview evaluation.
- **Bilingual Voice Engine**: Native English (`en-IN`) and Hindi (`hi-IN` / हिन्दी) voice career guidance with reactive audio waveform visualization.

---

## 🚀 Implemented Features

### 1. Secure Authentication & Role Isolation
- **5 Supported Roles**: Student, Industry, Academician, Institution, and System Administrator.
- **Public Protection**: System Administrator role is strictly blocked from public registration portals.
- **Multi-Step Onboarding**: Role-specific data collection workflows (education, domains, research expertise, accreditation).

### 2. Normalized Profile System & CRUD
- Unified profile management across Skills, Production Projects, Accredited Certifications, Honors/Achievements, and Institutional Documents.
- Public candidate view (`/profile/[id]`) with career readiness ratings.

### 3. Skill Intelligence & Assessment Engine (`/skills`, `/assessment`)
- Configurable 4-dimension question bank (Technical, Soft Skills, Aptitude, Career Interests).
- Incremental answer persistence, resume capability, and deterministic multi-vector score calculation.
- **Explainable Skill Gap Matrix**: Interactive radar comparison against target engineering roles with quantifiable deficit calculation.

### 4. AI Career Intelligence & Resume Analyzer (`/ai-career`)
- Contextual AI Career Assistant aware of candidate's verified skills, benchmark deficits, and target roles.
- Non-fabricating resume analyzer with key entity extraction and compatibility grading.
- 4-Phase Personalized Milestone Career Roadmap (Current State → Skill Gaps → Learning Strategy → Target Role → Next Actions).

### 5. Opportunity Marketplace & Explainable Matching (`/opportunities`, `/opportunities/manage`)
- Structured industry postings (Internships, Jobs, Live Projects, Apprenticeships, FDPs).
- **Transparent Compatibility Engine**: Decomposes candidate compatibility into verified strong skills (✓), partial matches (⚠), and missing gaps (✗).
- 5-Stage Recruiter Pipeline (`Applied` → `Reviewed` → `Shortlisted` → `Interviewed` → `Offered`) with real-time student notification alerts.

### 6. Role-Specific Intelligence Dashboards
- **Industry Dashboard (`/dashboard/industry`)**: Recruiter talent discovery radar, compatibility rankings, and candidate pipeline tracking.
- **Institution Dashboard (`/dashboard/institution`)**: University cohort analytics, placement funnels, internship participation rates, and **Department $\times$ Skill Domain Deficiency Heatmaps**.
- **Academician Portal (`/dashboard/academician`)**: 8 live collaboration tracks (FDPs, Faculty Internships, Consultancy, Research Grants, Mentorship).

### 7. Verified Digital Portfolio & Mentorship Hub (`/portfolio`, `/mentorship`)
- **Verified vs Self-Declared Distinction**: Distinguishes institution-authenticated credentials from self-declared candidate items with cryptographic hash stamps (`TITAN-VERIF-...`).
- **3D Perspective Cards**: Interactive perspective tilt and specular lighting on hover.
- **1-on-1 Mentorship Center**: Mentor discovery catalog, structured request booking, milestone checklist, and 1-5 star post-session rating modal.

### 8. AI Mock Interview Simulator & Bilingual Voice Guidance
- Target role specialization selector (AI Systems Engineer, Cloud Native SRE, Full-Stack Architect).
- Multi-vector evaluation (Technical Relevance $40\%$, Completeness $30\%$, Communication $20\%$, Confidence $10\%$) with exemplar model answers and practice drills.
- **Bilingual Voice Guidance**: Native English and Hindi (हिन्दी) audio speech synthesis.
- Prominent educational practice disclaimer.

---

## 🔑 Demo Credentials

| Role | Email | Password | Dashboard Link |
|---|---|---|---|
| **Student** | `student@titan.ai` | `TitanSecure#2026` | `/dashboard` |
| **Industry Recruiter** | `recruiter@titan.ai` | `TitanSecure#2026` | `/dashboard/industry` |
| **Academician Faculty** | `faculty@titan.ai` | `TitanSecure#2026` | `/dashboard/academician` |
| **Institution Admin** | `institution@titan.ai` | `TitanSecure#2026` | `/dashboard/institution` |
| **System Admin** | `admin@titan.ai` | `TitanSecure#2026` | `/admin` |

---

## 🎬 Primary SIH Demonstration Flow

Demonstrate the full platform journey in 12 seamless stages:

1. **Student Registration**: Register `student@titan.ai` and complete multi-step onboarding.
2. **Skill Assessment**: Execute diagnostic assessment across Technical, Soft Skills, and Aptitude.
3. **Skill Profile**: View computed readiness score and diagnostic level mappings.
4. **Skill Gap Matrix**: Inspect explainable gap radar comparing candidate skills vs Target Role.
5. **AI Career Roadmap**: Generate the 4-Phase personalized learning timeline.
6. **Marketplace Discovery**: Search matching internships at NVIDIA, Google Cloud, and Titan Labs.
7. **Explainable Match**: Review Strong (✓), Partial (⚠), and Gap (✗) skill breakdown.
8. **Application Submission**: Submit candidate application with telemetry snapshot.
9. **Recruiter Review**: Switch to `recruiter@titan.ai` and shortlist applicant.
10. **Recruiter AI Ranking**: Discover ranked candidates for open roles.
11. **Institution Analytics**: Switch to `institution@titan.ai` and analyze Department Deficiency Heatmaps.
12. **Verified Digital Portfolio**: Inspect 3D credential cards and stamp official cryptographic verification hash.

---

## ⚠️ Known Limitations

1. **Web Speech API Environment Support**: Voice dictation and speech synthesis rely on modern browser Web Speech APIs (`SpeechRecognition` / `SpeechSynthesis`). When unsupported or permissions are denied, the system provides zero-lag text fallbacks.
2. **Deterministic Fallback Repositories**: Includes production-grade memory stores for zero-latency presentation demos when Supabase PostgreSQL connections are offline.
3. **External LLM Gateways**: When external OpenAI/Anthropic API keys are not supplied, the platform falls back to structured rule-based deterministic heuristics rather than generating hallucinated responses.

---

## 🔮 Recommended Future Improvements

1. **Blockchain Credential Ledger**: Bridge cryptographic verification hashes to Ethereum/Polygon soulbound tokens (SBTs) for verifiable decentralized diplomas.
2. **Automated Code Sandbox Grading**: Integrate a live WebAssembly/Docker execution engine for runtime evaluation during AI mock technical interviews.
3. **Multi-Institution Federated Benchmarks**: Enable inter-university anonymous benchmark comparisons for state and national NIRF readiness rankings.

---

## 🛠️ Verification & Test Suite Execution

Run all 8 automated test suites verifying 80 test cases:
```bash
npm run typecheck
npm run lint
npm run build
```
