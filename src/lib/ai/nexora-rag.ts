/**
 * Nexora.ai - RAG Knowledge Engine & Semantic Retrieval for KaushalSetu
 * SIH 2026 Problem Statement #26044
 * Supports Bilingual English & Hindi/Hinglish Natural Conversational Intelligence
 */

export interface RAGDocument {
  id: string;
  category: "overview" | "features" | "stakeholders" | "roadmaps" | "faq" | "matching" | "contact" | "interview" | "portfolio";
  title: string;
  keywords: string[];
  content: string;
  citation: string;
}

export const NEXORA_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: "ks-overview",
    category: "overview",
    title: "KaushalSetu Platform Overview & Mission",
    keywords: [
      "kaushalsetu", "what is", "kya hai", "about", "mission", "vision", "technova",
      "objective", "overview", "kaushal setu", "platform", "purpose", "tagline"
    ],
    citation: "KaushalSetu Core Architecture • Team TechNova",
    content: `KaushalSetu is an adaptive AI-powered personalized learning, skill intelligence, and mentorship ecosystem engineered by Team TechNova.
Tagline: "Connecting Skills • Bridging Opportunities" | "Bridging Skills with Opportunity."
Core Purpose: To eliminate the massive disconnect between academic curricula and industry hiring demands by providing transparent, skill-first assessments, personalized adaptive learning roadmaps, and explainable AI opportunity matching for students, colleges, and recruiters.`
  },
  {
    id: "ks-how-it-works",
    category: "features",
    title: "The 4-Step How It Works Journey",
    keywords: [
      "how it works", "steps", "kaise kaam karta hai", "process", "workflow", "4 steps",
      "discover skills", "identify gaps", "build readiness", "connect opportunities", "lifecycle"
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
      "why match", "kaise match hota hai", "formula", "criteria", "ats", "breakdown"
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
      "portfolio", "interview", "resume", "roadmap", "student portal"
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
      "curriculum", "placement", "analytics", "naac", "nba", "outcomes", "institution portal"
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
      "jobs", "internships", "projects", "skill-first", "resume fraud", "recruiter portal"
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
      "learning path", "syllabus", "phases", "course", "kya seekhe", "guide", "frontend", "backend"
    ],
    citation: "KaushalSetu Industry Career Curricula 2026",
    content: `KaushalSetu provides structured 4-phase roadmaps for top tech domains:
1. **Full Stack Web Development**: Phase 1: HTML5, CSS3, Modern JS, Git -> Phase 2: React, Next.js 14, Tailwind CSS -> Phase 3: Node.js, Express, PostgreSQL/Prisma, Redis -> Phase 4: CI/CD, Docker, Cloud Deployment, End-to-End SaaS Capstone.
2. **AI & Machine Learning**: Phase 1: Python, NumPy, Pandas, Linear Algebra -> Phase 2: Scikit-learn, PyTorch/TensorFlow, Model Training -> Phase 3: LLMs, LangChain, RAG, Vector DBs -> Phase 4: Production ML Deployment, FastAPI, Docker, Cloud GPU Scaling.
3. **Cloud & DevOps**: Phase 1: Linux Admin, Bash, Networking -> Phase 2: Docker, Containerization, Kubernetes -> Phase 3: Terraform, AWS/GCP Core Services -> Phase 4: GitHub Actions CI/CD, Prometheus/Grafana Monitoring.
4. **Data Science & Analytics**: Phase 1: Python, SQL, Statistics -> Phase 2: EDA, Feature Engineering, PowerBI/Tableau -> Phase 3: Predictive Modeling, Time Series -> Phase 4: Business Intelligence & Decision Dashboards.`
  },
  {
    id: "ks-interview-simulator",
    category: "interview",
    title: "Bilingual AI Mock Interview Simulator",
    keywords: [
      "interview", "mock interview", "simulator", "interview practice", "bilingual interview",
      "voice interview", "technical questions", "hr round", "interview score"
    ],
    citation: "AI Mock Interview & Evaluation Engine",
    content: `KaushalSetu features an AI Mock Interview Simulator:
- **Bilingual Practice**: Conduct audio and text mock interviews in English or Hindi.
- **Dynamic Questions**: Generates realistic behavioral and technical interview questions tailored to target roles (e.g. React Frontend Engineer, Python Data Scientist).
- **Instant Rubric Evaluation**: Breaks down answers on 3 core pillars: Technical Correctness, Communication & Articulation, and Answer Completeness (0-100%).
- **Actionable Correction**: Highlights missing keywords and provides exemplar answers.`
  },
  {
    id: "ks-portfolio",
    category: "portfolio",
    title: "Cryptographic Verified Digital Portfolio",
    keywords: [
      "portfolio", "digital portfolio", "verified credentials", "github sync", "project showcase",
      "certificates", "proof of work", "badge", "tamper proof"
    ],
    citation: "Cryptographic Portfolio & Verification Ledger",
    content: `The KaushalSetu Portfolio Engine enables students to build proof-of-work portfolios:
- **GitHub & Code Synchronization**: Fetches commits, repos, and verified languages directly.
- **Institutional Endorsements**: Faculty and mentors can cryptographically verify project authenticity.
- **Sharable Public Link**: Generates a tamper-proof live portfolio URL for recruiter discovery.`
  },
  {
    id: "ks-contact",
    category: "contact",
    title: "Official KaushalSetu Contact & Channels",
    keywords: [
      "contact", "email", "phone", "instagram", "support", "help", "connect", "reach out",
      "number", "mail", "team", "whatsapp"
    ],
    citation: "KaushalSetu Official Communications Directory",
    content: `Official Support & Communication Channels for KaushalSetu:
- 📧 Email: kaushalsetu.edu@gmail.com
- 📱 Phone / WhatsApp: +91 91584 70655
- 📸 Instagram: @kaushal_setu (Profile: https://www.instagram.com/kaushal_setu?igsi=a2ZmajhtZmw1Mndh)
- 📍 Organization: Team TechNova (KaushalSetu AI Learning Ecosystem)`
  }
];

// Keywords indicating in-scope topics regarding KaushalSetu, careers, skills, tech, and education
const IN_SCOPE_TERMS = [
  "kaushalsetu", "kaushal", "setu", "sih", "smart india", "26044", "skill", "skills", "gap", "career",
  "roadmap", "roadmaps", "interview", "mock", "resume", "cv", "portfolio", "project", "projects",
  "assessment", "quiz", "benchmark", "learning", "course", "internship", "internships", "job", "jobs",
  "placement", "placements", "college", "colleges", "university", "faculty", "professor", "recruiter",
  "recruiters", "industry", "company", "hiring", "talent", "matching", "explainable", "score", "readiness",
  "developer", "engineer", "python", "javascript", "typescript", "react", "next.js", "node", "ai", "ml",
  "devops", "cloud", "docker", "kubernetes", "sql", "database", "contact", "support", "help", "email",
  "phone", "how it works", "steps", "kya hai", "kaise", "batao", "seekhe", "guide", "nexora"
];

// Keywords indicating clearly out-of-scope topics (e.g. politics, gossip, cooking, weather, general trivia)
const OUT_OF_SCOPE_PATTERNS = [
  /\b(weather|temperature|forecast|barish|mausam)\b/i,
  /\b(president|prime minister|politics|election|modi|biden|trump|congress|bjp|vote)\b/i,
  /\b(recipe|cook|food|biryani|cake|pizza|khana banana)\b/i,
  /\b(cricket|ipl|football|fifa|messi|ronaldo|virat kohli|rohit sharma|score)\b/i,
  /\b(movie|cinema|actor|actress|bollywood|hollywood|song|gaana|film)\b/i,
  /\b(horoscope|astrology|rashifal|zodiac)\b/i,
  /\b(capital of|largest country|who won|joke|comedy|funny joke|shayari)\b/i,
  /\b(bitcoin price|crypto market|stock price|gold rate)\b/i,
];

/**
 * Check if the query is in-scope for KaushalSetu platform
 */
export function isQueryInScope(query: string): boolean {
  const q = query.toLowerCase().trim();

  // Greetings are always in-scope
  if (/^(hi|hello|hey|namaste|namaskar|good morning|good evening|who are you|tum kaun ho|help)\b/i.test(q)) {
    return true;
  }

  // Explicitly check for out-of-scope keywords
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(q)) {
      return false;
    }
  }

  // Check if any in-scope platform or career term is present
  const tokens = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
  for (const token of tokens) {
    if (token.length >= 3 && IN_SCOPE_TERMS.some((term) => term.includes(token) || token.includes(term))) {
      return true;
    }
  }

  // Check if length is small greeting or question about KaushalSetu
  if (tokens.length <= 3 && (q.includes("about") || q.includes("info") || q.includes("work") || q.includes("feature"))) {
    return true;
  }

  return false;
}

/**
 * Retrieve top relevant chunks using hybrid keyword & semantic scoring
 */
export function retrieveRAGContext(query: string, limit: number = 3): { documents: RAGDocument[]; citations: string[] } {
  const qClean = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const queryTokens = qClean.split(/\s+/).filter((t) => t.length > 1);

  const scored = NEXORA_KNOWLEDGE_BASE.map((doc) => {
    let score = 0;

    // Title match
    const titleLower = doc.title.toLowerCase();
    queryTokens.forEach((token) => {
      if (titleLower.includes(token)) score += 6;
    });

    // Keyword match
    doc.keywords.forEach((kw) => {
      if (query.toLowerCase().includes(kw)) {
        score += 10;
      }
      queryTokens.forEach((token) => {
        if (kw.includes(token)) score += 4;
      });
    });

    // Content match
    const contentLower = doc.content.toLowerCase();
    queryTokens.forEach((token) => {
      if (contentLower.includes(token)) score += 1;
    });

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.doc);
  const finalDocs = matched.length > 0 ? matched : [NEXORA_KNOWLEDGE_BASE[0], NEXORA_KNOWLEDGE_BASE[1]];
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
  const q = userQuery.toLowerCase().trim();

  // Detect language tone: Hindi / Hinglish vs English
  const isHinglish = /kya|kaise|batao|karna|chahiye|hai|hain|mujhe|tum|mera|meri|kaha|kaun|kaise|seekhe|milenga|namaste|shukriya|madad|bhai|kaushalsetu/.test(q);

  const nameGreeting = userProfile?.fullName ? userProfile.fullName : "Learner";

  // GUARDRAIL: Out-of-Scope Query Check
  if (!isQueryInScope(q)) {
    let outOfScopeReply = "";
    if (isHinglish) {
      outOfScopeReply = `Kshama kijiye, par main **Nexora.ai** hoon — **KaushalSetu** platform ka dedicated AI Career & Skill Intelligence Copilot.\n\n` +
        `Main sirf **KaushalSetu** platform features, **Skill Gap Diagnostics**, **Career Roadmaps**, **Explainable Matching**, aur **Interviews** se related sawalon ka jawab dene ke liye banaya gaya hoon.\n\n` +
        `💡 *Aap mujhse KaushalSetu platform, aapke career roadmap, ya skill development ke baare mein koi bhi sawal pooch sakte hain!*`;
    } else {
      outOfScopeReply = `I apologize, but as the dedicated AI Career & Skill Intelligence Assistant for **KaushalSetu**, I am specialized strictly in platform features, skill-gap diagnostics, personalized career roadmaps, explainable opportunity matching, and academic-industry workflows.\n\n` +
        `I am unable to assist with topics outside the domain of KaushalSetu and career intelligence.\n\n` +
        `💡 *Please feel free to ask me anything about **KaushalSetu**, your **career roadmap**, **verified skills**, or **internship matching**!*`;
    }

    return {
      reply: outOfScopeReply,
      citations: ["KaushalSetu Intelligence Scope Guardrail • SIH 2026"],
      suggestedPrompts: [
        "How does KaushalSetu work?",
        "Show 4-phase Full Stack Roadmap",
        "What is Explainable AI Matching?",
        "How to prepare for Mock Interviews?",
      ],
    };
  }

  // Greetings
  if (q.includes("hi") || q.includes("hello") || q.includes("namaste") || q.includes("hey") || q.includes("who are you")) {
    let reply = "";
    if (isHinglish) {
      reply = `Namaste ${nameGreeting}! Main hoon **Nexora.ai**, aapka AI Career & Skill Intelligence Copilot for **KaushalSetu** (SIH 2026 Problem Statement #26044).\n\n` +
        `Main aapki in areas mein madad kar sakta hoon:\n` +
        `- 🎯 **Skill Gap Analysis**: Aapke target role ke liye missing skills diagnose karna.\n` +
        `- 🗺️ **Personalized Career Roadmaps**: Step-by-step 4-phase learning tracks.\n` +
        `- ⚡ **Explainable AI Matching**: Transparent compatibility score ke sath internships & jobs discover karna.\n` +
        `- 🎙️ **Bilingual Mock Interviews**: Technical & behavioral rounds ki live voice practice.\n` +
        `- 🏛️ **College & Recruiter Features**: Institutional telemetry aur zero-resume-fraud hiring.\n\n` +
        `Aap kya explore karna chahte hain?`;
    } else {
      reply = `Hello ${nameGreeting}! I am **Nexora.ai**, your AI Career & Skill Intelligence Copilot for **KaushalSetu** (SIH 2026 Problem Statement #26044).\n\n` +
        `Here is how I can empower your journey today:\n` +
        `- 🎯 **Diagnose Skill Gaps**: Uncover missing competencies for your dream engineering role.\n` +
        `- 🗺️ **Personalized Roadmaps**: 4-phase milestone roadmaps tailored to industry demand.\n` +
        `- ⚡ **Explainable AI Matching**: Transparent compatibility breakdown for top jobs & internships.\n` +
        `- 🎙️ **Bilingual Mock Interviews**: Practice audio/text mock interviews in English or Hindi.\n` +
        `- 🏛️ **Ecosystem Telemetry**: Explore data insights for colleges and recruiters.\n\n` +
        `What would you like to explore today?`;
    }

    return {
      reply,
      citations: ["KaushalSetu Core Architecture • SIH PS #26044"],
      suggestedPrompts: [
        "How does KaushalSetu explainable matching work?",
        "Generate a 3-month AI & ML Roadmap",
        "Tell me about the Mock Interview Simulator",
        "What are the benefits for colleges?",
      ],
    };
  }

  // Specific Query Routing
  const { documents, citations } = retrieveRAGContext(userQuery);

  if (q.includes("roadmap") || q.includes("path") || q.includes("seekhe") || q.includes("learn") || q.includes("syllabus")) {
    if (q.includes("ai") || q.includes("ml") || q.includes("machine learning") || q.includes("data science")) {
      const reply = `### 🤖 4-Phase AI & Machine Learning Career Roadmap\n\n` +
        `Industry-calibrated curriculum on **KaushalSetu**:\n\n` +
        `1. **Phase 1: Foundations (Weeks 1–4)**\n` +
        `   - Python 3.11+, NumPy, Pandas, Data Wrangling\n` +
        `   - Linear Algebra, Probability, Statistics, Calculus essentials\n` +
        `2. **Phase 2: Core Machine Learning (Weeks 5–8)**\n` +
        `   - Scikit-learn, Supervised & Unsupervised Learning, XGBoost\n` +
        `   - Cross-Validation, Feature Engineering, Hyperparameter Optimization\n` +
        `3. **Phase 3: Deep Learning & Generative AI (Weeks 9–14)**\n` +
        `   - PyTorch, Neural Networks, CNNs & Transformers\n` +
        `   - Hugging Face, LangChain, RAG Architecture, Vector DBs (Chroma/Pinecone)\n` +
        `4. **Phase 4: Production Deployment & MLOps (Weeks 15–18)**\n` +
        `   - FastAPI model inference server, Docker containerization\n` +
        `   - Cloud GPU deployment & real-time monitoring telemetry.\n\n` +
        `💡 *Complete KaushalSetu skill assessments after each phase to earn verified digital credentials!*`;

      return {
        reply,
        citations: ["KaushalSetu Industry Career Curricula 2026", "AI Learning Matrix v2.0"],
        suggestedPrompts: [
          "How do I bridge my skill gaps for AI?",
          "What projects should I build for my portfolio?",
          "How does KaushalSetu verify my skills?",
        ],
      };
    } else {
      const reply = `### 🚀 4-Phase Full Stack Modern Web Developer Roadmap\n\n` +
        `Step-by-step career trajectory on **KaushalSetu**:\n\n` +
        `1. **Phase 1: Core Fundamentals (Weeks 1–3)**\n` +
        `   - Semantic HTML5, Modern CSS3, Flexbox/Grid, Responsive Design\n` +
        `   - Modern JavaScript (ES6+), Async/Await, DOM manipulation, Git & GitHub\n` +
        `2. **Phase 2: Frontend Engineering (Weeks 4–7)**\n` +
        `   - React 18+, Next.js 14 App Router, TypeScript\n` +
        `   - Tailwind CSS, State Management (Zustand/Redux), Framer Motion animations\n` +
        `3. **Phase 3: Backend & Database Architecture (Weeks 8–11)**\n` +
        `   - Node.js, Express, PostgreSQL, Prisma ORM, Redis caching\n` +
        `   - RESTful APIs, JWT Authentication, WebSockets\n` +
        `4. **Phase 4: Production Readiness & Deployment (Weeks 12–16)**\n` +
        `   - Docker, CI/CD with GitHub Actions, Vercel/AWS deployment\n` +
        `   - Build a full-stack SaaS Capstone and link it to your KaushalSetu Verified Portfolio.`;

      return {
        reply,
        citations: ["KaushalSetu Industry Career Curricula 2026", "Web Systems Standard"],
        suggestedPrompts: [
          "How to test my Full Stack skills on KaushalSetu?",
          "What is the Explainable Matching score for Web Dev?",
          "How to practice Mock Interviews for Frontend roles?",
        ],
      };
    }
  }

  if (q.includes("interview") || q.includes("mock") || q.includes("practice")) {
    const reply = `### 🎙️ Bilingual AI Mock Interview Simulator\n\n` +
      `**KaushalSetu** offers a real-time conversational interview environment:\n\n` +
      `- 🌐 **Bilingual Support**: Practice in **English** or **Hindi** with natural voice speech.\n` +
      `- 🎯 **Role-Specific Scenarios**: Dynamic technical & behavioral interview prompts for roles like Frontend, AI Engineer, Cloud Architect.\n` +
      `- 📊 **3-Pillar Rubric Scoring**:\n` +
      `  1. **Technical Accuracy**: Depth and correctness of conceptual explanation.\n` +
      `  2. **Communication & Structure**: Clarity, articulation, and professional tone.\n` +
      `  3. **Completeness**: Addressing all parts of the scenario with real-world examples.\n` +
      `- 💡 **Actionable Feedback**: Instant tips on missed keywords and model answers.\n\n` +
      `👉 *Head over to the **AI Career Studio -> Mock Interview** tab to start your session!*`;

    return {
      reply,
      citations: ["AI Mock Interview & Evaluation Engine", "Bilingual Speech Matrix v1.4"],
      suggestedPrompts: [
        "How does the scoring rubric work?",
        "What questions are asked for Full Stack roles?",
        "How can I improve my communication score?",
      ],
    };
  }

  if (q.includes("how it works") || q.includes("kaise kaam") || q.includes("process") || q.includes("steps")) {
    const reply = `### 🔄 How KaushalSetu Works (4-Step Progression)\n\n` +
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

    return {
      reply,
      citations: ["Platform Workflow Engine • How It Works Spec"],
      suggestedPrompts: [
        "What is Explainable Matching?",
        "How do colleges benefit?",
        "How do recruiters find talent?",
      ],
    };
  }

  if (q.includes("college") || q.includes("institution") || q.includes("university") || q.includes("academia")) {
    const reply = `### 🏛️ Benefits for Colleges & Academic Institutions\n\n` +
      `KaushalSetu empowers college placement cells and departments with data-driven insights:\n\n` +
      `- 📊 **Real-Time Cohort Analytics**: View department-wise (CSE, IT, ECE) skill health and average readiness scores.\n` +
      `- 🔍 **Early Gap Detection**: Identify critical deficits (e.g. System Design, Cloud) 6 months before campus placements.\n` +
      `- 📚 **Curriculum Alignment Engine**: Automated suggestions to update course syllabi with in-demand industry technologies.\n` +
      `- 🏆 **Accreditation Reports**: Export verified placement, internship, and project participation records for NAAC & NBA audits.\n` +
      `- 🤝 **Direct Industry MoUs**: Seamlessly partner with recruiters for campus hiring and guest mentorship sessions.`;

    return {
      reply,
      citations: ["Institutional Analytics & Curriculum Suite"],
      suggestedPrompts: [
        "How do recruiters use KaushalSetu?",
        "What are the student benefits?",
        "Show me the contact details for KaushalSetu",
      ],
    };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("instagram") || q.includes("reach") || q.includes("whatsapp")) {
    const reply = `### 📞 Connect with the KaushalSetu Team\n\n` +
      `We'd love to assist you! Reach out through any of our official channels:\n\n` +
      `- 📧 **Email**: [kaushalsetu.edu@gmail.com](mailto:kaushalsetu.edu@gmail.com)\n` +
      `- 📱 **Phone / WhatsApp**: [+91 91584 70655](tel:+919158470655)\n` +
      `- 📸 **Instagram**: [@kaushal_setu](https://www.instagram.com/kaushal_setu?igsi=a2ZmajhtZmw1Mndh)\n\n` +
      `*KaushalSetu • Engineered by Team TechNova*`;

    return {
      reply,
      citations: ["KaushalSetu Official Communications Directory"],
      suggestedPrompts: [
        "What is KaushalSetu's mission?",
        "How does skill gap analysis work?",
        "How can our college partner with KaushalSetu?",
      ],
    };
  }

  // General RAG Synthesis from retrieved knowledge chunks
  const contextContent = documents.map((d) => `### ${d.title}\n${d.content}`).join("\n\n");

  const reply = `### ⚡ Nexora.ai Intelligence Response\n\n` +
    `Based on the **KaushalSetu RAG Knowledge Base**:\n\n` +
    `${contextContent}\n\n` +
    `---\n` +
    `💡 *Need more specific guidance? You can ask me to generate a custom roadmap, analyze skill gaps, or explain matching scores!*`;

  return {
    reply,
    citations,
    suggestedPrompts: [
      "How does Explainable Matching work?",
      "Show 4-phase Full Stack Roadmap",
      "What are the benefits for colleges?",
      "How to contact KaushalSetu team?",
    ],
  };
}
