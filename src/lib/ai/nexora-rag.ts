/**
 * Nexora.ai - RAG Knowledge Engine & Semantic Retrieval for KaushalSetu
 * SIH 2026 Problem Statement #26044
 */

export interface RAGDocument {
  id: string;
  category: "overview" | "features" | "stakeholders" | "roadmaps" | "faq" | "matching" | "contact";
  title: string;
  keywords: string[];
  content: string;
  citation: string;
}

export const NEXORA_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: "ks-overview",
    category: "overview",
    title: "KaushalSetu Platform Overview & SIH 2026 Mission",
    keywords: [
      "kaushalsetu", "what is", "kya hai", "about", "mission", "vision", "sih", "smart india hackathon",
      "26044", "problem statement", "objective", "overview", "kaushal setu", "platform"
    ],
    citation: "KaushalSetu Core Architecture • SIH PS #26044",
    content: `KaushalSetu is an AI-powered unified employability, skill intelligence, and mentorship ecosystem built for Smart India Hackathon 2026 (Problem Statement #26044).
Tagline: "Connecting Skills • Bridging Opportunities" | "Bridging Skills with Opportunity."
Core Purpose: To eliminate the massive disconnect between academic curricula and industry hiring demands by providing transparent, skill-first assessments, personalized learning roadmaps, and explainable AI opportunity matching for students, colleges, and recruiters.`
  },
  {
    id: "ks-how-it-works",
    category: "features",
    title: "The 4-Step How It Works Journey",
    keywords: [
      "how it works", "steps", "kaise kaam karta hai", "process", "workflow", "4 steps",
      "discover skills", "identify gaps", "build readiness", "connect opportunities"
    ],
    citation: "Platform Workflow Engine • How It Works Spec",
    content: `KaushalSetu operates through a seamless 4-step progressive lifecycle:
1. 🟢 Step 01: Discover Skills (Know Yourself Better) - AI-powered multi-vector skill assessment, strength identification, and personalized skill profile generation.
2. 🟣 Step 02: Identify Gaps (Know What's Missing) - Automated skill gap analysis against live industry role benchmarks, deficit calculation, and Career Readiness Scoring (0-100%).
3. 🔵 Step 03: Build Readiness (Turn Gaps Into Growth) - Dynamic, personalized 4-phase learning roadmaps, curated courses, coding challenges, and milestone progress tracking.
4. 🟡 Step 04: Connect Opportunities (From Skills to Opportunity) - Explainable AI matching with verified internships, live industry projects, direct campus hiring, and 1-on-1 industry mentors.`
  },
  {
    id: "ks-explainable-ai",
    category: "matching",
    title: "Explainable AI Matching Algorithm vs. Black Box",
    keywords: [
      "explainable", "matching", "algorithm", "score", "black box", "compatibility", "percentage",
      "why match", "kaise match hota hai", "formula", "criteria"
    ],
    citation: "Explainable AI Matching Engine v2.4",
    content: `Unlike black-box ATS filters that reject resumes silently, KaushalSetu uses Explainable AI Matching:
- **Transparent Compatibility Breakdown**: Shows students exactly why they match a role (e.g. 88% Match = 45% Technical Skills Verified + 25% Project Evidence + 18% Cognitive/Soft Skills).
- **Matched vs. Missing Skills**: Highlights green verified skills (e.g. Next.js, SQL) and missing prerequisite skills (e.g. Docker, Redis).
- **Actionable Gap Bridging**: Gives exact learning steps and projects needed to reach a 95%+ match.`
  },
  {
    id: "ks-students",
    category: "stakeholders",
    title: "Students & Aspirants Capabilities",
    keywords: [
      "student", "students", "aspirants", "learners", "job seeker", "fresher", "features for students",
      "portfolio", "interview", "resume", "roadmap"
    ],
    citation: "Student Intelligence Portal • KaushalSetu",
    content: `For Students & Aspirants ("Discover. Develop. Get Ahead."):
- AI-Powered Skill Assessment & Multi-Dimensional Profiling.
- Personalized Career & Learning Roadmaps calibrated to dream roles.
- Real-Time Skill-Gap Diagnostics against Fortune-500 & Startup hiring demands.
- Verified Digital Portfolio with tamper-proof institutional endorsements.
- AI Career Copilot (Nexora.ai) & Bilingual Mock Interview Simulator (Hindi/English).`
  },
  {
    id: "ks-institutions",
    category: "stakeholders",
    title: "Colleges, Universities & Academia Benefits",
    keywords: [
      "college", "colleges", "university", "institutions", "academia", "faculty", "professors",
      "curriculum", "placement", "analytics", "naac", "nba", "outcomes"
    ],
    citation: "Institutional Analytics & Curriculum Suite",
    content: `For Academia & Colleges ("Turn Data Into Better Outcomes."):
- Real-Time Student Cohort Skill & Readiness Analytics.
- Identify common skill deficits across departments (CSE, IT, ECE) before placement season.
- Automated Curriculum Alignment suggestions based on live industry trends.
- Placement Tracking & Participation metrics for NAAC/NBA accreditation reports.
- Data-driven insights to organize targeted workshops and faculty development.`
  },
  {
    id: "ks-industry",
    category: "stakeholders",
    title: "Industry & Recruiters Features",
    keywords: [
      "industry", "recruiters", "companies", "hiring", "talent", "hr", "employers",
      "jobs", "internships", "projects", "skill-first", "resume fraud"
    ],
    citation: "Recruiter Discovery & Verification Matrix",
    content: `For Industry & Recruiters ("Find Talent Beyond the Resume."):
- Skill-First Candidate Discovery: Filter students by verified GitHub repos, live code assessments, and practical scores.
- Zero Resume Fraud: All credentials and project submissions are institutionally and cryptographically verified.
- Direct Internship & Live Project Posting with instant candidate matching.
- Reduced Time-to-Hire: Direct interview pipelines from Tier-1, Tier-2, and Tier-3 colleges.`
  },
  {
    id: "ks-roadmaps",
    category: "roadmaps",
    title: "Popular Tech Career Roadmaps & Skill Tracks",
    keywords: [
      "roadmap", "full stack", "ai", "ml", "data science", "devops", "cloud", "cybersecurity",
      "learning path", "syllabus", "phases", "course", "kya seekhe", "guide"
    ],
    citation: "KaushalSetu Industry Career Curricula 2026",
    content: `KaushalSetu provides structured 4-phase roadmaps for top tech domains:
1. **Full Stack Web Development**: Phase 1: HTML5, CSS3, Modern JS, Git -> Phase 2: React, Next.js 14, Tailwind CSS -> Phase 3: Node.js, Express, PostgreSQL/Prisma, Redis -> Phase 4: CI/CD, Docker, Cloud Deployment, End-to-End SaaS Capstone.
2. **AI & Machine Learning**: Phase 1: Python, NumPy, Pandas, Linear Algebra -> Phase 2: Scikit-learn, PyTorch/TensorFlow, Model Training -> Phase 3: LLMs, LangChain, RAG, Vector DBs -> Phase 4: Production ML Deployment, FastAPI, Docker, Cloud GPU Scaling.
3. **Cloud & DevOps**: Phase 1: Linux Admin, Bash, Networking -> Phase 2: Docker, Containerization, Kubernetes -> Phase 3: Terraform, AWS/GCP Core Services -> Phase 4: GitHub Actions CI/CD, Prometheus/Grafana Monitoring.
4. **Data Science & Analytics**: Phase 1: Python, SQL, Statistics -> Phase 2: EDA, Feature Engineering, PowerBI/Tableau -> Phase 3: Predictive Modeling, Time Series -> Phase 4: Business Intelligence & Decision Dashboards.`
  },
  {
    id: "ks-contact",
    category: "contact",
    title: "Official KaushalSetu Contact & Channels",
    keywords: [
      "contact", "email", "phone", "instagram", "support", "help", "connect", "reach out",
      "number", "mail", "team"
    ],
    citation: "KaushalSetu Official Communications Directory",
    content: `Official Support & Communication Channels for KaushalSetu:
- 📧 Email: kaushalsetu.edu@gmail.com
- 📱 Phone / WhatsApp: +91 91584 70655
- 📸 Instagram: @kaushal_setu (Profile: https://www.instagram.com/kaushal_setu?igsi=a2ZmajhtZmw1Mndh)
- 📍 Organization: Smart India Hackathon 2026 (Team Tech-Titan / KaushalSetu)`
  }
];

/**
 * Retrieve top relevant chunks using hybrid keyword & semantic scoring
 */
export function retrieveRAGContext(query: string, limit: number = 3): { documents: RAGDocument[]; citations: string[] } {
  const qClean = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const queryTokens = qClean.split(/\s+/).filter((t) => t.length > 1);

  const scored = NEXORA_KNOWLEDGE_BASE.map((doc) => {
    let score = 0;

    // Check title match
    const titleLower = doc.title.toLowerCase();
    queryTokens.forEach((token) => {
      if (titleLower.includes(token)) score += 5;
    });

    // Check keywords match
    doc.keywords.forEach((kw) => {
      if (query.toLowerCase().includes(kw)) {
        score += 10;
      }
      queryTokens.forEach((token) => {
        if (kw.includes(token)) score += 3;
      });
    });

    // Check content match
    const contentLower = doc.content.toLowerCase();
    queryTokens.forEach((token) => {
      if (contentLower.includes(token)) score += 1;
    });

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.doc);

  // If no specific match found, fallback to overview & how-it-works
  const finalDocs = selected.length > 0 ? selected : [NEXORA_KNOWLEDGE_BASE[0], NEXORA_KNOWLEDGE_BASE[1]];
  const citations = Array.from(new Set(finalDocs.map((d) => d.citation)));

  return { documents: finalDocs, citations };
}

/**
 * Generate an intelligent, structured RAG response from Nexora.ai
 */
export function generateNexoraRAGResponse(
  userQuery: string,
  userProfile?: { fullName?: string; role?: string; targetRole?: string; readinessScore?: number; skills?: string[] }
): {
  reply: string;
  citations: string[];
  suggestedPrompts: string[];
} {
  const { documents, citations } = retrieveRAGContext(userQuery);
  const q = userQuery.toLowerCase();

  // Detect language tone: Hinglish / Hindi vs English
  const isHinglish = /kya|kaise|batao|karna|chahiye|hai|hain|mujhe|tum|mera|meri|kaha|kaun|kaise|seekhe|milenga/.test(q);

  let reply = "";
  let suggestedPrompts: string[] = [];

  const nameGreeting = userProfile?.fullName ? `${userProfile.fullName}` : "Student Learner";

  if (q.includes("hi") || q.includes("hello") || q.includes("namaste") || q.includes("hey")) {
    if (isHinglish) {
      reply = `Namaste ${nameGreeting}! Main hoon **Nexora.ai**, aapka AI Career & Skill Intelligence Copilot for **KaushalSetu**.\n\n` +
        `Main aapki kaise madad kar sakta hoon?\n` +
        `- 🎯 **Skill Gap Analysis**: Aapke target role ke liye missing skills identify karna.\n` +
        `- 🗺️ **Personalized Roadmap**: Step-by-step career path & learning guide banana.\n` +
        `- 💼 **Opportunity Matching**: Internships aur live projects ke saath transparent match score dekhna.\n` +
        `- 🏫 **Platform Queries**: KaushalSetu ke 4-step workflow ya college/industry benefits ko samajhna.`;
    } else {
      reply = `Hello ${nameGreeting}! I am **Nexora.ai**, your AI Career & Skill Intelligence Copilot for **KaushalSetu**.\n\n` +
        `Here is how I can assist you today:\n` +
        `- 🎯 **Diagnose Skill Gaps**: Uncover exactly what skills you need for your target tech roles.\n` +
        `- 🗺️ **Personalized Roadmaps**: Generate customized milestone-driven learning paths.\n` +
        `- ⚡ **Explainable AI Matching**: Discover verified internships & jobs matched to your verified skills.\n` +
        `- 🏛️ **Ecosystem Guidance**: Learn how students, colleges, and industry collaborate seamlessly.`;
    }

    suggestedPrompts = [
      "How does KaushalSetu explainable matching work?",
      "Generate a 3-month Full Stack Roadmap",
      "How do colleges benefit from KaushalSetu?",
      "What are the 4 steps in How It Works?",
    ];
  } else if (q.includes("roadmap") || q.includes("path") || q.includes("seekhe") || q.includes("learn") || q.includes("syllabus")) {
    if (q.includes("ai") || q.includes("ml") || q.includes("machine learning") || q.includes("data science")) {
      reply = `### 🤖 4-Phase AI & Machine Learning Career Roadmap\n\n` +
        `Here is your industry-calibrated learning track on **KaushalSetu**:\n\n` +
        `1. **Phase 1: Foundations (Weeks 1–4)**\n` +
        `   - Python 3.11+, NumPy, Pandas, Data Wrangling\n` +
        `   - Linear Algebra, Probability, Calculus essentials\n` +
        `2. **Phase 2: Core Machine Learning (Weeks 5–8)**\n` +
        `   - Scikit-learn, Regression, Decision Trees, Ensembles (XGBoost)\n` +
        `   - Model Validation, Feature Engineering, Hyperparameter Tuning\n` +
        `3. **Phase 3: Deep Learning & Generative AI (Weeks 9–14)**\n` +
        `   - PyTorch, Neural Networks, CNNs & Transformers\n` +
        `   - Hugging Face, LangChain, RAG Architecture, Vector DBs (Chroma/Pinecone)\n` +
        `4. **Phase 4: Production Deployment & MLOps (Weeks 15–18)**\n` +
        `   - FastAPI model inference server, Docker containerization\n` +
        `   - Cloud GPU deployment & real-time monitoring.\n\n` +
        `💡 *Tip: Complete KaushalSetu skill assessments after each phase to earn verified digital badges!*`;
    } else {
      reply = `### 🚀 4-Phase Full Stack Modern Web Developer Roadmap\n\n` +
        `Here is your recommended step-by-step pathway:\n\n` +
        `1. **Phase 1: Core Fundamentals (Weeks 1–3)**\n` +
        `   - Semantic HTML5, Modern CSS3, Flexbox/Grid, Responsive UI\n` +
        `   - Modern JavaScript (ES6+), Async/Await, DOM manipulation, Git/GitHub\n` +
        `2. **Phase 2: Frontend Engineering (Weeks 4–7)**\n` +
        `   - React 18+, Next.js 14 App Router, TypeScript\n` +
        `   - Tailwind CSS, State Management (Zustand/Redux), Framer Motion\n` +
        `3. **Phase 3: Backend & Database Architecture (Weeks 8–11)**\n` +
        `   - Node.js, Express, PostgreSQL, Prisma ORM, Redis caching\n` +
        `   - RESTful APIs, JWT Authentication, WebSockets\n` +
        `4. **Phase 4: Production Readiness & Deployment (Weeks 12–16)**\n` +
        `   - Docker, CI/CD with GitHub Actions, Vercel/AWS deployment\n` +
        `   - Build a full-stack SaaS Capstone project and link it to your KaushalSetu Portfolio.`;
    }

    suggestedPrompts = [
      "How do I bridge my skill gaps for this roadmap?",
      "What projects should I build for my portfolio?",
      "How does KaushalSetu verify my skills?",
    ];
  } else if (q.includes("how it works") || q.includes("kaise kaam") || q.includes("process") || q.includes("steps")) {
    reply = `### 🔄 How KaushalSetu Works (4-Step Progression)\n\n` +
      `**01. 🟢 Discover Skills (Know Yourself Better)**\n` +
      `- AI-powered adaptive skill assessments across Technical, Soft Skills, and Aptitude.\n` +
      `- Generates your verified hexagonal skill radar profile.\n\n` +
      `**02. 🟣 Identify Gaps (Know What's Missing)**\n` +
      `- Live benchmark comparison against industry role demands.\n` +
      `- Instant calculation of Career Readiness Score (e.g., 68% -> Target: 85%).\n\n` +
      `**03. 🔵 Build Readiness (Turn Gaps Into Growth)**\n` +
      `- Personalized 4-phase learning roadmaps with curated modules.\n` +
      `- Step-by-step milestone tracking & coding challenges.\n\n` +
      `**04. 🟡 Connect Opportunities (From Skills to Opportunity)**\n` +
      `- Transparent Explainable AI matching with top internships & jobs.\n` +
      `- Direct industry recruitment and 1-on-1 mentorship.`;

    suggestedPrompts = [
      "What is Explainable Matching?",
      "How do colleges benefit?",
      "How do recruiters find talent?",
    ];
  } else if (q.includes("college") || q.includes("institution") || q.includes("university") || q.includes("academia")) {
    reply = `### 🏛️ Benefits for Colleges & Academic Institutions\n\n` +
      `KaushalSetu transforms college placement cells and departments with data-driven insights:\n\n` +
      `- 📊 **Real-Time Cohort Analytics**: View department-wise (CSE, IT, ECE) skill health and average readiness scores.\n` +
      `- 🔍 **Early Gap Detection**: Identify critical deficits (e.g. System Design, Cloud) 6 months before campus placements.\n` +
      `- 📚 **Curriculum Alignment Engine**: Automated suggestions to update course syllabi with in-demand industry technologies.\n` +
      `- 🏆 **Accreditation Reports**: Export verified placement, internship, and project participation records for NAAC & NBA audits.\n` +
      `- 🤝 **Direct Industry MoUs**: Seamlessly partner with recruiters for campus hiring and guest mentorship sessions.`;

    suggestedPrompts = [
      "How do recruiters use KaushalSetu?",
      "What are the student benefits?",
      "Show me the contact details for KaushalSetu",
    ];
  } else if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("instagram") || q.includes("reach")) {
    reply = `### 📞 Connect with the KaushalSetu Team\n\n` +
      `We'd love to assist you! Reach out through any of our official channels:\n\n` +
      `- 📧 **Email**: [kaushalsetu.edu@gmail.com](mailto:kaushalsetu.edu@gmail.com)\n` +
      `- 📱 **Phone**: [+91 91584 70655](tel:+919158470655)\n` +
      `- 📸 **Instagram**: [@kaushal_setu](https://www.instagram.com/kaushal_setu?igsi=a2ZmajhtZmw1Mndh)\n\n` +
      `*Smart India Hackathon 2026 • Problem Statement #26044*`;

    suggestedPrompts = [
      "What is KaushalSetu's mission?",
      "How does skill gap analysis work?",
      "How can our college partner with KaushalSetu?",
    ];
  } else {
    // General RAG Synthesis from retrieved knowledge chunks
    const contextContent = documents.map((d) => `### ${d.title}\n${d.content}`).join("\n\n");

    reply = `### ⚡ Nexora.ai Intelligence Response\n\n` +
      `Based on the **KaushalSetu RAG Knowledge Base**:\n\n` +
      `${contextContent}\n\n` +
      `---\n` +
      `💡 *Need more specific guidance? You can ask me to generate a custom roadmap, analyze skill gaps, or explain matching scores!*`;

    suggestedPrompts = [
      "How does Explainable Matching work?",
      "Show 4-phase Full Stack Roadmap",
      "What are the benefits for colleges?",
      "How to contact KaushalSetu team?",
    ];
  }

  return {
    reply,
    citations,
    suggestedPrompts,
  };
}
