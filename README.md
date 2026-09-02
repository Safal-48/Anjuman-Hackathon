<div align="center">

# 🌐 KAUSHALSETU
### **Autonomous AI Personalized Learning Ecosystem & Continuous Skill Intelligence Platform**

*Bridging the divide between academic learning and industry readiness through empirical performance feedback.*

[![Engineered By](https://img.shields.io/badge/Engineered%20By-Team%20TechNova-06b6d4?style=for-the-badge&logo=codeforces&logoColor=white)](https://github.com/Safal-48/Anjuman-Hackathon)
[![Next.js](https://img.shields.io/badge/Next.js%2014-App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25%20Strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Three.js](https://img.shields.io/badge/3D%20Engine-React%20Three%20Fiber-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

</div>

---

## 📖 Executive Summary & Core Product Vision

Traditional learning platforms and LMS solutions suffer from a fatal flaw: **Course Completion is treated as Skill Mastery.** Watching a 10-hour tutorial or obtaining a completion certificate does not prove genuine competency.

**KaushalSetu** is not a course platform and not just a chatbot. It is an **Autonomous Adaptive AI Learning Ecosystem** that:
1. Continuously observes a student's actual diagnostic and sandbox performance.
2. Identifies granular sub-skill deficits rather than vague overall percentages.
3. Computes multi-factor priority scores to determine **"What do I learn first?"**.
4. Delivers targeted 15-minute Socratic remediation sprints in English, Hindi, and Hinglish.
5. Adapts question difficulty in real time (scaffolding with analogies on failure vs. leveling up on success).
6. Requires empirical reassessment proof ($42\% \rightarrow 82\%$) before certifying **🟢 SKILL PROVEN**.
7. Automatically shifts roadmap milestones and unlocks the next priority in real time.

$$\mathbf{\text{ASSESS}} \longrightarrow \mathbf{\text{UNDERSTAND}} \longrightarrow \mathbf{\text{PRIORITIZE}} \longrightarrow \mathbf{\text{LEARN}} \longrightarrow \mathbf{\text{PRACTICE}} \longrightarrow \mathbf{\text{PROVE}} \longrightarrow \mathbf{\text{REASSESS}} \longrightarrow \mathbf{\text{ADAPT}}$$

---

## 🏛️ High-Level System Architecture

```
                                  ╔══════════════════════════════════════╗
                                  ║         STUDENT ONBOARDING           ║
                                  ║  Primary Goal + Self-Declared Skills ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║    AI DIAGNOSTIC ASSESSMENT ENGINE   ║
                                  ║   Granular Sub-Topic Topic Matrix    ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║       DYNAMIC PERSONAL SKILL DNA     ║
                                  ║  Self-Declared vs. Demonstrated Proof║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║    PERFORMANCE-BASED PRIORITY ENGINE ║
                                  ║  Calculates #1 Critical Bottleneck   ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║   NEXT BEST ACTION COMMAND CENTER    ║
                                  ║      "DO THIS FIRST" Hero Banner     ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║  15-MIN SOCRATIC REMEDIATION SPRINT  ║
                                  ║   Multilingual Hinglish + Analogies  ║
                                  ║    Adaptive Difficulty Branching     ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                                                     ▼
                                  ╔══════════════════════════════════════╗
                                  ║     TIMED REASSESSMENT PROBE         ║
                                  ║       Empirical Verification         ║
                                  ╚══════════════════╦═══════════════════╝
                                                     ║
                           ┌─────────────────────────┴─────────────────────────┐
                           ▼                                                   ▼
            [ Score < 75% Mastery ]                             [ Score ≥ 75% Mastery ]
                   ⚠️ Deficit                                          🟢 PROVEN
      ╔═══════════════════════════════════╗               ╔═══════════════════════════════════╗
      ║  AUTOMATIC FOLLOW-UP INTERVENTION ║               ║     SKILL PROVEN CERTIFICATION    ║
      ║  Lightweight Mistake Memory Radar ║               ║  • Skill DNA Status Upgraded      ║
      ╚═══════════════════════════════════╝               ║  • Adaptive Roadmap Mutates       ║
                                                          ║  • Next Priority Node Unlocks     ║
                                                          ║  • Cryptographic Hash Stamped     ║
                                                          ╚═══════════════════════════════════╝
```

---

## ⚡ Key Modules & Feature Highlights

### 1. 🎯 Next Best Action Student Command Center (`/dashboard`)
- **Apex Dashboard Banner**: Displays the student's current primary goal (*Become a Data Analyst*), live readiness progress ($68\%$), current critical bottleneck (*SQL JOINs*), and the single highest-yield **Next Best Action** (*Practice SQL JOINs — 15 min*).
- **"WHY THIS?" Justification**: Backed by actual telemetry (*"Your recent accuracy is 43%, and JOINs are a high-dependency prerequisite for your selected goal."*).

### 2. 🧬 Dynamic Personal Skill DNA (`/skills`)
- **Unverified Badging**: Self-declared skills from onboarding remain tagged `[Unverified (0% Demonstrated)]` until tested.
- **Continuous Telemetry Radar**: Tracks confidence levels, directional trend vectors ($\uparrow$, $\rightarrow$, $\downarrow$), logged practice attempts, and flags **⚠️ Recurring Weaknesses**.

### 3. 🗺️ Continuous Adaptive Learning Roadmap (`/learning/roadmap`)
- **5-Stage Connected Milestones**: Every single node links:
  $$\mathbf{\text{Learning Resource}} \longrightarrow \mathbf{\text{Socratic Explanation}} \longrightarrow \mathbf{\text{Interactive Practice}} \longrightarrow \mathbf{\text{Diagnostic Probe}} \longrightarrow \mathbf{\text{Verified Result}}$$
- **Dynamic Graph Mutation**: When a student proves mastery in SQL JOINs ($42\% \rightarrow 84\%$), the node automatically transitions to `🟢 Skill Proven`, track progress jumps from $38\% \rightarrow 52\%$, and *Power BI & Advanced Analytics* unlocks as the new priority.

### 4. ⚡ 15-Minute Targeted Socratic Remediation (`/learning/intervention`)
- **7-Stage Socratic Loop**:
  `1. Concept Brief` $\rightarrow$ `2. Real-World Zomato Example` $\rightarrow$ `3. Guided Question` $\rightarrow$ `4. Student Answer` $\rightarrow$ `5. AI Feedback` $\rightarrow$ `6. Adaptive Practice` $\rightarrow$ `7. Mini Assessment`.
- **Adaptive Difficulty Branching**:
  - **On Correct Answer**: Dynamically escalates difficulty to advanced edge-cases (*e.g., `COUNT(*)` vs `COUNT(column)` in outer joins*).
  - **On Incorrect Answer**: Enters *Scaffold Mode* with an intuitive *Class Attendance Register* analogy and simplified practice questions.

### 5. 🤖 Multilingual AI Socratic Learning Assistant (`/learning/assistant`)
- Contextually aware of student skill deficits, time budgets, and target roles.
- Supports conversational Socratic tutoring in **English**, **Hindi (हिन्दी)**, and **Hinglish** (*e.g., "Bhai mujhe SQL JOIN Zomato ke example se samjha"*).
- Generates realistic micro-plans based on available time (*"I only have 20 minutes today"*).

### 6. 🎛️ “What If?” Learning Impact Simulator (`/learning/goals`)
- Interactive multi-skill proficiency sliders allowing students to simulate:
  $$\text{Baseline: } 64\% \xrightarrow{\text{Simulate SQL } 52\% \rightarrow 80\%} \text{Projected Readiness: } 76\% \quad (+12\% \text{ Boost})$$
- Shows shifted next priority bottlenecks and ranks learning activities by **ROI (Readiness Boost per Hour of Study)**.

### 7. 📉 Recurring Mistake Memory & Skill Decay Radar (`/progress/history`)
- **Mistake Memory Trail**: Detects concepts failed repeatedly across Assessment 1 $\rightarrow$ Practice $\rightarrow$ Assessment 2, flagging them as **`⚠️ Recurring Weakness`**.
- **Ebbinghaus Decay Monitor**: Compares historical peak score vs. current evaluated performance (*e.g., SQL $84\% \rightarrow 63\%$, $\downarrow 21\%$ Decay*) and triggers proactive spaced repetition drills.

### 8. 📊 Evidence-Based Proven Skills Matrix (`/progress/performance`)
- Enforces the core mastery axiom:
  $$\mathbf{\text{Course Completion} \neq \text{Skill Mastery}} \qquad \Longleftrightarrow \qquad \mathbf{\text{Empirical Evidence} = \text{Proven Competency}}$$
- Categorizes all skills across 4 explicit evidence pillars: *Learning Completed*, *Practice Accuracy*, *Assessment Score*, and *Proven Status*.

### 9. 🎙️ AI Mock Interview + Privacy-First Attention Monitoring (`/mock-interview`)
- **Mandatory Pre-Interview Equipment & Permission Gate**: Before initiating any mock session, a dedicated permission gate activates and calibrates the webcam, ensuring camera access while guaranteeing 100% privacy: **Raw camera feeds remain strictly local and are NEVER recorded or uploaded**.
- **Client-Side Real-Time Attention Engine**: Evaluates screen-facing head/face orientation (Yaw/Pitch) with a **3.0-second continuous deviation grace period** to tolerate natural movements. No biometric facial ID, emotion analysis, or demographic profiling.
- **Neutral Warning Terminology & Red Viewport Glow**: If a student is continuously distracted for $>3.0\text{s}$, the viewport triggers a gentle red glow with neutral notices (*`⚠ Attention Check: Please maintain your focus on the screen.`*) and a soft audio chime. Automatically clears upon focus recovery without interrupting the session.
- **Detailed Attention Event Ledger**: Records structured, non-punitive events:
  $$\text{Direction (Left / Right / Up / Down / Face Not Visible)} \quad\bullet\quad \text{Duration (e.g. } 4.2\text{s)} \quad\bullet\quad \text{Timestamp} \quad\bullet\quad \text{Severity (Low / Med / High)}$$
- **Animated "INTERVIEW COMPLETED" Performance Popup**: Summarizes 6 rating dimensions:
  $$\text{Overall Performance (7.2/10)} \quad\bullet\quad \text{Technical Knowledge} \quad\bullet\quad \text{Communication} \quad\bullet\quad \text{Answer Quality} \quad\bullet\quad \text{Problem Solving} \quad\bullet\quad \text{Confidence} \quad\bullet\quad \mathbf{\text{Attention Consistency (88\%)}}$$
  Includes status badges (*`✓ Focus Consistency Good`* vs *`⚠ Focus Consistency Needs Improvement`*), treating attention as a supportive behavioral signal.
- **Closed-Loop Learning Engine Feed**: Converts interview performance directly into actionable KaushalSetu remediation:
  $$\text{Technical Deficit (SQL 52\%)} \longrightarrow \text{Personal Skill DNA Updated} \longrightarrow \text{Next Best Action: "Practice SQL JOINs — 15 min"} \longrightarrow \text{Targeted Intervention} \longrightarrow \text{Roadmap Adapt}$$

### 10. 📄 Connected Resume ATS Analyzer (`/resume-analyzer`)
- **Resume Claimed vs. Demonstrated Gaps**: Cross-references resume bullet points against verified diagnostic test logs to expose unverified claims (*"Resume: Advanced SQL vs. Test: 58%"*).

### 11. 🛡️ Verified Digital Portfolio Ledger (`/portfolio`)
- Stamped with institutional cryptographic verification hashes (`TITAN-VERIF-...`) and rendered on 3D tilt perspective cards.

---

## 💻 Complete Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | **Next.js 14** (App Router, Server Components, Streaming SSR), **React 18** |
| **Language & Typing** | **TypeScript 5.0+** (Strict Mode, 100% Type-Safe, Zero `any` Leaks), **Zod** |
| **Styling & Aesthetics** | **Tailwind CSS**, Vanilla CSS Custom Tokens, Obsidian/Cyberpunk Dark Mode, Glassmorphism |
| **3D & Micro-Animations** | **Three.js**, **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`), **Framer Motion**, **GSAP** |
| **Database & Persistence**| **Supabase PostgreSQL**, Row-Level Security (RLS), TypeScript Database Definitions |
| **Speech & Audio Engine** | **Web Speech API** (`SpeechRecognition` / `SpeechSynthesis`) with Hindi/English bilingual fallback |
| **Icons & Design Primitives** | **Lucide React**, **Radix UI** Accessibility Primitives, **Class Variance Authority (CVA)** |

---

## 📂 Project Directory Structure

```
├── src/
│   ├── app/                               # Next.js 14 App Router
│   │   ├── (auth)/                        # Authentication routes (Login, Register)
│   │   ├── onboarding/                    # 5-Step Profiling & Self-Declared Badging
│   │   ├── dashboard/                     # Apex Next Best Action Command Center
│   │   │   ├── industry/                  # Recruiter Talent Discovery Radar
│   │   │   ├── institution/               # University Cohort & Skill Gap Heatmaps
│   │   │   └── academician/               # Faculty Collaboration Tracks
│   │   ├── assessment/                    # Granular Sub-Topic Diagnostic Probe
│   │   ├── skills/                        # Personal Skill DNA & Priority Queue
│   │   ├── learning/
│   │   │   ├── assistant/                 # Multilingual Socratic AI Tutor
│   │   │   ├── roadmap/                   # Dynamic 5-Stage Adaptive Roadmap
│   │   │   ├── resources/                 # 4-Pillar Explainable Recommendation Cards
│   │   │   ├── intervention/              # 15-Min Remediation Sprint Studio
│   │   │   └── goals/                     # "What If?" Impact Simulator & Goal Engine
│   │   ├── progress/
│   │   │   ├── performance/               # Evidence-Based Proven Skills Matrix
│   │   │   ├── growth/                    # Empirical Mastery Velocity (Pre vs Post)
│   │   │   └── history/                   # Recurring Mistake Memory & Decay Radar
│   │   ├── practice/                      # Multi-Modal Practice Arena
│   │   ├── resume-analyzer/               # Claimed vs. Demonstrated Verification
│   │   ├── mock-interview/                # AI Oral Technical Defense Exam
│   │   ├── opportunities/                 # Transparent Matching Marketplace
│   │   └── portfolio/                     # 3D Cryptographic Portfolio Ledger
│   ├── components/
│   │   ├── demo/                          # 14-Step Presentation Tour Modal
│   │   ├── dashboard/                     # Command Center Hero & Metric Cards
│   │   ├── skills/                        # Skill DNA, Priority Engine & Diagnostic Matrix
│   │   ├── roadmap/                       # Adaptive Milestone Pipeline Visualizer
│   │   ├── learning/                      # Intervention Runner & Socratic Engine
│   │   ├── simulation/                    # "What If?" Live Multi-Skill Sliders
│   │   ├── progress/                      # Evidence Matrix & Mistake Decay Monitor
│   │   ├── ai/                            # Resume Analyzer & Mock Interview Rooms
│   │   ├── layout/                        # Cyberpunk Navbar, Footer, Container & Sidebar
│   │   └── ui/                            # Glow Cards, Badges, Buttons, 3D Canvas
│   └── lib/                               # Core Business Logic & AI Engines
│       ├── ai/                            # Socratic Coach, Voice Synthesis, RAG Knowledge
│       ├── skills/                        # Skill DNA Repository, Priority Gap Engine
│       ├── roadmap/                       # Adaptive Roadmap Pipeline State Machine
│       ├── learning/                      # 7-Step Intervention & Empirical Loop Engines
│       ├── simulation/                    # "What If?" Deterministic Forecast Engine
│       ├── memory/                        # Recurring Mistake Memory & Decay Engine
│       ├── progress/                      # Evidence-Based Competency Types
│       ├── auth/                          # 5-Role Context & Session Management
│       └── db/                            # Supabase / Relational Repositories
└── public/                                # Static assets, 3D glTF models & sound assets
```

---

## 🔑 Multi-Role Demo Credentials

The platform features role-based access control across 5 distinct ecosystem perspectives:

| Role | Email | Password | Access Sector |
| :--- | :--- | :--- | :--- |
| **Student Learner** | `student@titan.ai` | `TitanSecure#2026` | [`/dashboard`](http://localhost:3000/dashboard) |
| **Industry Recruiter** | `recruiter@titan.ai` | `TitanSecure#2026` | [`/dashboard/industry`](http://localhost:3000/dashboard/industry) |
| **Academician / Faculty** | `faculty@titan.ai` | `TitanSecure#2026` | [`/dashboard/academician`](http://localhost:3000/dashboard/academician) |
| **Institution Admin** | `institution@titan.ai` | `TitanSecure#2026` | [`/dashboard/institution`](http://localhost:3000/dashboard/institution) |
| **System Administrator** | `admin@titan.ai` | `TitanSecure#2026` | [`/admin`](http://localhost:3000/admin) |

---

## 🎬 14-Step Canonical Presentation Walkthrough

When demonstrating KaushalSetu to evaluators, click the glowing **` Judge Tour`** button in the top navigation bar to launch the guided walkthrough, or follow these steps manually:

1. **Onboarding (`/onboarding`)**: Register and set goal: *Become a Data Analyst*. Notice how self-declared skills are tagged `[Unverified (0% Demonstrated)]`.
2. **Diagnostic Assessment (`/assessment`)**: Take the assessment. The AI tests 7 granular sub-topics (Basics 86%, Filtering 78%, JOINs 42% ).
3. **Personal Skill DNA (`/skills`)**: Inspect Skill DNA. SQL is flagged as a *Recurring Weakness* with downward trend ($\downarrow$).
4. **Priority Engine (`/skills`)**: View the 94/100 Priority Score designating SQL JOINs as the #1 critical blocker (`DO THIS FIRST`).
5. **"Why This?" Explanation (`/learning/resources`)**: Inspect 4-pillar explainable cards detailing *What, Why, What it improves, and What to do after*.
6. **Command Center Hero (`/dashboard`)**: View the top hero banner answering *"What do I do next?"* in 3 seconds.
7. **Socratic AI Tutor (`/learning/assistant`)**: Ask for a Hinglish explanation of SQL JOINs with Zomato order-table analogies.
8. **15-Min Targeted Sprint (`/learning/intervention`)**: Execute the 7-step remediation sprint with adaptive difficulty branching.
9. **Empirical Reassessment (`/learning/intervention`)**: Complete the 3-question diagnostic probe proving score gain from $42\% \rightarrow 82\%$.
10. **🟢 Skill Proven Certification (`/progress/performance`)**: Skill DNA updates from *Critical Deficit* to *Demonstrated & Verified*.
11. **Adaptive Roadmap Mutation (`/learning/roadmap`)**: Watch the roadmap dynamically advance and unlock *Power BI* as the next priority.
12. **Resume Verification Gap (`/resume-analyzer`)**: View cross-referenced comparison of resume claims vs. demonstrated test scores.
13. **AI Mock Interview (`/mock-interview`)**: Complete a simulated technical oral defense with automatic remedial action triggers.
14. **Digital Portfolio Ledger (`/portfolio`)**: Inspect 3D perspective credential cards stamped with cryptographic verification hashes.

---

## ⚙️ Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** / **yarn** / **pnpm**

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Safal-48/Anjuman-Hackathon.git
   cd Anjuman-Hackathon
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory (optional for offline presentation demo mode):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: The system includes zero-latency deterministic mock stores and works 100% out of the box without external database connections.)*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

5. **Execute Validation & Test Suite:**
   ```bash
   npm run typecheck    # 100% Strict TypeScript validation
   npm run lint         # ESLint code quality checks
   npm run build        # Production bundle compilation
   ```

---

##  Summary of Differentiators

| Traditional EdTech & LMS | KaushalSetu (Team TechNova) |
| :--- | :--- |
| ❌ Video completion = Skill mastery | ✅ **Empirical Evidence = Demonstrated Competency** |
| ❌ Fixed static syllabus & schedules | ✅ **Continuous Adaptive Roadmap that Mutates on Performance** |
| ❌ Vague overall score percentage (e.g., 65%) | ✅ **Granular Sub-Topic Topic Matrix (e.g., SQL JOINs: 42%)** |
| ❌ Generic 10-hour video recommendations | ✅ **15-Minute Targeted Socratic Remediation Sprints** |
| ❌ Blind self-declared skill acceptance | ✅ **Distinguishes Self-Declared from Demonstrated Evidence** |
| ❌ Static single-attempt test results | ✅ **Recurring Mistake Memory & Ebbinghaus Decay Radar** |

---

<div align="center">

**KaushalSetu — Engineered with precision by Team TechNova**  
*Turning skills into verified opportunities, and potential into high-impact careers.*

</div>
