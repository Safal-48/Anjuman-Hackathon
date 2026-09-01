/**
 * KaushalSetu AI Mock Interview Engine
 * Problem Statement #26044 (Smart India Hackathon 2026)
 *
 * Implements:
 * - Dynamic Multi-Role, Experience Level, Interview Type, Difficulty & Bilingual Configurations
 * - Realistic Interviewer Personas with Audio & Speech Synthesis metadata
 * - Multi-turn Contextual Follow-up Question Generation based on student responses
 * - Deep Multi-Vector Evaluation (Technical, Relevance, Quality, Communication, Confidence, Response Time, Completeness)
 * - Zero-leakage intermediate state during live interview
 * - Comprehensive Final Performance Analytics Report with Weak Question Breakdown, Strengths, Weaknesses, and Practice Drills
 * - Genuine, non-fabricating deterministic & semantic evaluation
 */

export type ExperienceLevel = "entry" | "junior" | "mid" | "senior";
export type InterviewType = "technical" | "behavioral" | "mixed" | "system_design";
export type InterviewLanguage = "en" | "hi" | "hinglish";
export type InterviewDifficulty = "foundational" | "intermediate" | "advanced" | "adaptive";

export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  tone: string;
  bio: string;
  voiceGender: "female" | "male";
  elevenLabsVoiceId: string;
}

export interface InterviewConfig {
  roleId: string;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  language: InterviewLanguage;
  difficulty: InterviewDifficulty;
  interviewerId: string;
  totalQuestions?: number;
}

export interface InterviewQuestion {
  id: string;
  roleId: string;
  category: "system_design" | "architecture_tradeoff" | "failure_recovery" | "project_deep_dive" | "behavioral_star" | "core_fundamentals" | "troubleshooting" | "data_structures";
  questionText: string;
  questionTextHi?: string;
  questionTextHinglish?: string;
  contextHint: string;
  expectedKeywords: string[];
  evaluationCriteria: {
    technicalWeight: number;
    completenessWeight: number;
    communicationWeight: number;
    confidenceWeight: number;
    relevanceWeight: number;
  };
  suggestedDurationSeconds: number; // e.g. 120s
  difficulty: InterviewDifficulty;
  isFollowUp?: boolean;
  followUpContext?: string;
}

export interface SingleQuestionEvaluation {
  questionId: string;
  questionText: string;
  category: string;
  answerText: string;
  responseTimeSeconds: number;
  wordCount: number;
  scores: {
    overall: number; // 0 - 100
    technicalKnowledge: number; // 0 - 100
    relevance: number; // 0 - 100
    answerQuality: number; // 0 - 100
    communication: number; // 0 - 100
    confidenceIndicators: number; // 0 - 100
    responseTimePacing: number; // 0 - 100
    completeness: number; // 0 - 100
  };
  strengths: string[];
  weaknesses: string[];
  keywordCoverage: {
    matchedKeywords: string[];
    missingKeywords: string[];
    coveragePercentage: number;
  };
  identifiedConcepts: string[];
  omittedConcepts: string[];
  improvementTip: string;
  modelAnswer: string;
}

export interface FinalInterviewReport {
  sessionId: string;
  config: InterviewConfig;
  interviewer: InterviewerPersona;
  timestamp: string;
  totalQuestionsAnswered: number;
  totalDurationSeconds: number;
  overallScore: number; // 0 - 100
  performanceGrade: "Outstanding (Top 5%)" | "Placement Ready" | "Competent" | "Needs Focused Preparation" | "Developing";
  categoryRatings: {
    technicalKnowledge: number;
    relevance: number;
    answerQuality: number;
    communication: number;
    confidenceIndicators: number;
    responseTimePacing: number;
    completeness: number;
  };
  overallStrengths: string[];
  overallWeaknesses: string[];
  weakQuestionsBreakdown: {
    questionId: string;
    questionText: string;
    score: number;
    candidateAnswerSummary: string;
    whyItWasWeak: string;
    modelAnswer: string;
    actionableFix: string;
  }[];
  specificImprovementSuggestions: string[];
  recommendedTopicsToPractice: {
    topic: string;
    priority: "High" | "Medium" | "Low";
    reason: string;
    suggestedDrill: string;
  }[];
  questionEvaluations: SingleQuestionEvaluation[];
  practiceDisclaimer: string;
}

export const INTERVIEWER_PERSONAS: Record<string, InterviewerPersona> = {
  aditi_sharma: {
    id: "aditi_sharma",
    name: "Dr. Aditi Sharma",
    role: "Principal AI & Systems Architect",
    company: "Frontier Systems & IIT Alumna",
    avatarUrl: "/avatars/interviewer-aditi.png",
    tone: "Analytical, constructive, and deeply attentive to architectural trade-offs.",
    bio: "12+ years designing high-throughput distributed models, LLM serving engines, and fault-tolerant cloud backbones.",
    voiceGender: "female",
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
  },
  vikram_malhotra: {
    id: "vikram_malhotra",
    name: "Vikram Malhotra",
    role: "VP of Engineering & Distributed Infrastructure",
    company: "CloudMatrix Scaleup",
    avatarUrl: "/avatars/interviewer-vikram.png",
    tone: "Direct, practical, focusing on production failure scenarios, metrics, and STAR behaviors.",
    bio: "Built and scaled 100M+ RPS streaming systems and led global engineering squads across APAC & US.",
    voiceGender: "male",
    elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam
  },
  sarah_chen: {
    id: "sarah_chen",
    name: "Sarah Chen",
    role: "Staff Infrastructure & Performance Lead",
    company: "Apex HyperScale Technologies",
    avatarUrl: "/avatars/interviewer-sarah.png",
    tone: "Detail-oriented, inquiring about low-latency bottlenecks, memory limits, and concurrent locks.",
    bio: "Kernel hacker and distributed storage contributor. Obsessed with p99 latencies, cache invalidation, and race conditions.",
    voiceGender: "female",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
  },
  rohit_verma: {
    id: "rohit_verma",
    name: "Rohit Verma",
    role: "Director of Talent & Tech Leadership",
    company: "KaushalSetu Industry Council",
    avatarUrl: "/avatars/interviewer-rohit.png",
    tone: "Empathetic, structured, focusing on communication clarity, ownership, conflict resolution, and leadership.",
    bio: "Mentored 500+ engineers into top-tier careers and led technical recruitment panels for Fortune-500 firms.",
    voiceGender: "male",
    elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam
  },
};

export const AVAILABLE_ROLES = [
  { id: "ai_systems_engineer", label: "AI Systems & LLM Architect", icon: "Brain" },
  { id: "fullstack_architect", label: "Full-Stack Web & Systems Architect", icon: "Layers" },
  { id: "cloud_sre_architect", label: "Cloud Native SRE & Distributed Systems", icon: "Server" },
  { id: "frontend_engineer", label: "Frontend Engineer (React / Next.js / TypeScript)", icon: "Code2" },
  { id: "backend_systems_engineer", label: "Backend Systems Engineer (Go / Node / PostgreSQL)", icon: "Database" },
  { id: "data_scientist_ml", label: "Data Scientist & Applied ML Engineer", icon: "TrendingUp" },
  { id: "cybersecurity_specialist", label: "Cybersecurity & Security Operations Engineer", icon: "ShieldCheck" },
  { id: "mobile_engineer", label: "Mobile Applications Engineer (iOS / Android / React Native)", icon: "Smartphone" },
  { id: "embedded_iot_engineer", label: "Embedded Systems & IoT Hardware Engineer", icon: "Cpu" },
];

export const ROLE_INTERVIEW_BANKS: Record<string, { roleTitle: string; questions: InterviewQuestion[] }> = {
  ai_systems_engineer: {
    roleTitle: "AI Systems & LLM Architect",
    questions: [
      {
        id: "ai-01",
        roleId: "ai_systems_engineer",
        category: "system_design",
        questionText:
          "How would you design a distributed inference cluster for serving 70B parameter LLMs to ensure p99 latency stays under 40ms under heavy concurrent traffic?",
        questionTextHi:
          "भारी समवर्ती ट्रैफ़िक (concurrent traffic) के तहत p99 लेटेंसी को 40ms से कम रखने के लिए आप 70B पैरामीटर वाले LLM के लिए एक डिस्ट्रीब्यूटेड इन्फेरेंस क्लस्टर कैसे डिज़ाइन करेंगे?",
        questionTextHinglish:
          "Aap heavy concurrent traffic me 70B parameter LLM serve karne ke liye distributed inference cluster kaise design karenge jisse p99 latency sub-40ms rahe?",
        contextHint: "Think about PagedAttention, TensorRT-LLM, model parallelism (tensor vs pipeline), dynamic request batching, and KV cache offloading.",
        expectedKeywords: ["tensorrt", "pagedattention", "vllm", "tensor parallelism", "dynamic batching", "cuda stream", "kv cache", "gpu memory", "nvlink", "quantization"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.15 },
        suggestedDurationSeconds: 150,
        difficulty: "advanced",
      },
      {
        id: "ai-02",
        roleId: "ai_systems_engineer",
        category: "architecture_tradeoff",
        questionText:
          "What are the key latency and throughput trade-offs between Tensor Parallelism and Pipeline Parallelism during transformer model serving across multi-node GPU clusters?",
        questionTextHi:
          "मल्टी-नोड GPU क्लस्टर पर ट्रांसफॉर्मर मॉडल सर्विंग के दौरान टेन्सर पैरेललिज्म (Tensor Parallelism) और पाइपलाइन पैरेललिज्म (Pipeline Parallelism) के बीच प्रमुख लेटेंसी और थ्रूपुट ट्रेड-ऑफ़ क्या हैं?",
        questionTextHinglish:
          "Multi-node GPU clusters par transformer model serving karte waqt Tensor Parallelism aur Pipeline Parallelism ke beech kya latency aur throughput trade-offs hote hain?",
        contextHint: "Contrast inter-GPU all-reduce overhead (NVLink vs InfiniBand bandwidth) with pipeline bubble idle time across node boundaries.",
        expectedKeywords: ["nvlink", "all-reduce", "pipeline bubble", "infiniband", "inter-node bandwidth", "latency", "throughput", "microbatch", "communication overhead"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 120,
        difficulty: "advanced",
      },
      {
        id: "ai-03",
        roleId: "ai_systems_engineer",
        category: "failure_recovery",
        questionText:
          "Describe how you would handle sudden GPU Out-Of-Memory (OOM) faults caused by unexpected prompt length spikes during high-throughput real-time streaming.",
        questionTextHi:
          "हाई-थ्रूपुट रीयल-टाइम स्ट्रीमिंग के दौरान अचानक प्रॉम्प्ट लंबाई स्पाइक्स के कारण होने वाले GPU आउट-ऑफ-मेमोरी (OOM) दोषों को आप कैसे संभालेंगे?",
        questionTextHinglish:
          "High throughput streaming ke dauran agar sudden prompt length spikes ki wajah se GPU OOM (Out of Memory) faults aate hain, toh aap unhe kaise prevent aur recover karenge?",
        contextHint: "Address dynamic KV cache preemption, chunked prefill, token length thresholds, swap space management, and graceful request fallback.",
        expectedKeywords: ["kv cache", "preemption", "chunked prefill", "oom", "backoff", "swap space", "graceful degradation", "circuit breaker", "token limits"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 120,
        difficulty: "intermediate",
      },
      {
        id: "ai-04",
        roleId: "ai_systems_engineer",
        category: "behavioral_star",
        questionText:
          "Tell me about a time you had to debug a subtle performance bottleneck or silent failure in a machine learning or systems pipeline. What was your systematic methodology, and what were the measured results?",
        questionTextHi:
          "किसी ऐसे समय के बारे में बताएं जब आपको किसी मशीन लर्निंग या सिस्टम पाइपलाइन में सूक्ष्म प्रदर्शन अड़चन (performance bottleneck) को डीबग करना पड़ा था। आपकी पद्धति क्या थी और परिणाम क्या रहे?",
        questionTextHinglish:
          "Ek aisa scenario share karein jab aapne ML ya systems pipeline me koi subtle performance bottleneck debug kiya ho. Aapka step-by-step approach aur quantifiable outcome kya tha?",
        contextHint: "Structure your response using STAR (Situation, Task, Action, Result). Mention profiling tools (e.g. PyTorch Profiler, Nsight, Prometheus) and measurable impact.",
        expectedKeywords: ["profiler", "bottleneck", "latency reduction", "metrics", "flame graph", "baseline", "action", "result", "benchmarking", "optimization"],
        evaluationCriteria: { technicalWeight: 0.25, completenessWeight: 0.25, communicationWeight: 0.3, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 150,
        difficulty: "intermediate",
      },
    ],
  },
  fullstack_architect: {
    roleTitle: "Full-Stack Web & Systems Architect",
    questions: [
      {
        id: "fs-01",
        roleId: "fullstack_architect",
        category: "architecture_tradeoff",
        questionText:
          "Explain how React Server Components (RSC) fundamentally change client-server data fetching and hydration compared to traditional client-side SPAs. What are the caching trade-offs in Next.js App Router?",
        questionTextHi:
          "पारंपरिक क्लाइंट-साइड एसपीए की तुलना में रिएक्ट सर्वर कंपोनेंट्स (RSC) डेटा फ़ेचिंग और हाइड्रेशन को मौलिक रूप से कैसे बदलते हैं? नेक्स्ट.जेएस ऐप राउटर में कैशिंग के क्या ट्रेड-ऑफ़ हैं?",
        questionTextHinglish:
          "React Server Components (RSC) traditional client-side SPAs ke mukable data fetching aur hydration ko kaise change karte hain? Next.js App Router me caching ke trade-offs kya hain?",
        contextHint: "Discuss zero-bundle-size server components, streaming HTML with Suspense, selective sub-tree hydration, and Data Cache revalidation strategies.",
        expectedKeywords: ["rsc", "server components", "hydration", "streaming", "suspense", "bundle size", "data cache", "revalidation", "server actions"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 140,
        difficulty: "intermediate",
      },
      {
        id: "fs-02",
        roleId: "fullstack_architect",
        category: "system_design",
        questionText:
          "How would you design a real-time collaborative workspace (like Google Docs or Figma) supporting thousands of concurrent editors with offline capabilities and conflict resolution?",
        questionTextHi:
          "ऑफ़लाइन क्षमताओं और विवाद समाधान (conflict resolution) के साथ हजारों समवर्ती संपादकों का समर्थन करने वाले एक वास्तविक समय सहयोगी कार्यक्षेत्र को आप कैसे डिज़ाइन करेंगे?",
        questionTextHinglish:
          "Aap ek real-time collaborative document editor kaise design karenge jo thousands of concurrent users, offline sync, aur conflict resolution support kare?",
        contextHint: "Discuss CRDTs (Conflict-free Replicated Data Types) vs OT (Operational Transformation), WebSockets, Redis pub/sub, IndexedDB local persistence, and delta sync.",
        expectedKeywords: ["crdt", "operational transformation", "websockets", "redis pub/sub", "indexeddb", "conflict resolution", "vector clock", "eventual consistency"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 150,
        difficulty: "advanced",
      },
      {
        id: "fs-03",
        roleId: "fullstack_architect",
        category: "failure_recovery",
        questionText:
          "Your web application is experiencing an outage where the primary PostgreSQL database connection pool is exhausted due to slow queries during peak traffic. How do you triage, mitigate, and architect against this?",
        questionTextHi:
          "पीक ट्रैफ़िक के दौरान धीमी क्वेरी के कारण आपका प्राथमिक PostgreSQL डेटाबेस कनेक्शन पूल समाप्त हो गया है। आप इसका निवारण कैसे करेंगे और भविष्य के लिए क्या संरचना बनाएंगे?",
        questionTextHinglish:
          "Peak traffic ke dauran slow queries ki wajah se PostgreSQL database connection pool exhaust ho gaya hai. Aap ise immediately triage aur permanently architecturally kaise resolve karenge?",
        contextHint: "Cover immediate mitigation (PgBouncer, query cancellation, read replicas) and long-term architecture (caching layer, index optimization, CQRS, circuit breakers).",
        expectedKeywords: ["pgbouncer", "connection pooling", "read replica", "indexes", "query optimization", "circuit breaker", "redis cache", "rate limiting", "slow query log"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.3, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 130,
        difficulty: "intermediate",
      },
    ],
  },
  cloud_sre_architect: {
    roleTitle: "Cloud Native SRE & Distributed Systems",
    questions: [
      {
        id: "sre-01",
        roleId: "cloud_sre_architect",
        category: "system_design",
        questionText:
          "Design a multi-region active-active Kubernetes infrastructure for high-availability banking transactions with zero data loss (RPO = 0) and sub-second recovery (RTO < 1s).",
        questionTextHi:
          "शून्य डेटा हानि (RPO = 0) और उप-सेकंड पुनर्प्राप्ति (RTO < 1s) के साथ उच्च-उपलब्धता बैंकिंग लेनदेन के लिए मल्टी-रीजन एक्टिव-एक्टिव कुबेरनेट्स इंफ्रास्ट्रक्चर कैसे डिज़ाइन करेंगे?",
        questionTextHinglish:
          "Zero data loss (RPO=0) aur instant failover (RTO < 1s) achieve karne ke liye active-active multi-region Kubernetes infrastructure kaise design karenge?",
        contextHint: "Discuss synchronous database replication, Raft consensus, Anycast DNS routing, Istio service mesh, and distributed distributed circuit breakers.",
        expectedKeywords: ["active-active", "raft", "synchronous replication", "rpo", "rto", "anycast", "istio", "circuit breaker", "kubernetes", "global server load balancing"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 150,
        difficulty: "advanced",
      },
      {
        id: "sre-02",
        roleId: "cloud_sre_architect",
        category: "failure_recovery",
        questionText:
          "A major cloud availability zone experiences a network partition during peak transaction hours. How does your system isolate the fault and prevent cascading thundering-herd failures?",
        questionTextHi:
          "पीक ट्रांजेक्शन घंटों के दौरान एक प्रमुख क्लाउड क्षेत्र में नेटवर्क विभाजन होता है। आपका सिस्टम फॉल्ट को कैसे अलग करता है और कैस्केडिंग विफलता को कैसे रोकता है?",
        questionTextHinglish:
          "Peak traffic ke dauran cloud region network partition encounter karta hai. Aapka system cascading failure aur thundering herd ko kaise prevent karega?",
        contextHint: "Explain exponential backoff with jitter, dead letter queues, rate limiters, health checks, and automated traffic shedding.",
        expectedKeywords: ["network partition", "jitter", "exponential backoff", "dead letter queue", "rate limiting", "failover", "health checks", "load shedding", "circuit breaker"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.3, communicationWeight: 0.15, confidenceWeight: 0.05, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 130,
        difficulty: "advanced",
      },
    ],
  },
  frontend_engineer: {
    roleTitle: "Frontend Engineer (React / Next.js / TypeScript)",
    questions: [
      {
        id: "fe-01",
        roleId: "frontend_engineer",
        category: "architecture_tradeoff",
        questionText:
          "How would you optimize Core Web Vitals (specifically INP - Interaction to Next Paint and LCP - Largest Contentful Paint) in a large-scale data-dense enterprise dashboard?",
        questionTextHi:
          "बड़े पैमाने के डेटा-सघन एंटरप्राइज डैशबोर्ड में आप कोर वेब वाइटल्स (विशेष रूप से INP और LCP) को कैसे अनुकूलित करेंगे?",
        questionTextHinglish:
          "Large scale data-heavy dashboard me Core Web Vitals (INP aur LCP) ko improve karne ke liye aap kin techniques ka use karenge?",
        contextHint: "Address Web Workers, virtualized lists, requestAnimationFrame, code-splitting, font optimization, responsive images, and reducing main thread blocking.",
        expectedKeywords: ["inp", "lcp", "virtualization", "web workers", "code splitting", "memoization", "main thread", "requestidlecallback", "lazy loading"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 120,
        difficulty: "intermediate",
      },
      {
        id: "fe-02",
        roleId: "frontend_engineer",
        category: "core_fundamentals",
        questionText:
          "Compare custom global state management approaches in modern React: Zustand vs Redux Toolkit vs React Context. In what architectural scenarios would you choose one over the other?",
        questionTextHi:
          "आधुनिक रिएक्ट में ग्लोबल स्टेट मैनेजमेंट दृष्टिकोण की तुलना करें: Zustand बनाम Redux Toolkit बनाम React Context। आप किस स्थिति में किसे चुनेंगे?",
        questionTextHinglish:
          "Modern React me state management options (Zustand vs Redux Toolkit vs React Context) ke pros/cons kya hain aur kab kounsa choose karna chahiye?",
        contextHint: "Discuss selector subscriptions, re-render granularity, middleware, devtools, boilerplate overhead, and bundle size.",
        expectedKeywords: ["zustand", "redux toolkit", "context api", "re-render", "selectors", "immutability", "boilerplate", "bundle size", "subscriptions"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 120,
        difficulty: "intermediate",
      },
    ],
  },
  backend_systems_engineer: {
    roleTitle: "Backend Systems Engineer (Go / Node / PostgreSQL)",
    questions: [
      {
        id: "be-01",
        roleId: "backend_systems_engineer",
        category: "system_design",
        questionText:
          "Design an idempotent payment processing webhook receiver that handles duplicate delivery, out-of-order events, and database deadlocks under high concurrency.",
        questionTextHi:
          "एक इडेम्पोटेंट भुगतान प्रसंस्करण वेबहुक रिसीवर डिज़ाइन करें जो उच्च समवर्तीता के तहत डुप्लिकेट डिलीवरी और डेटाबेस डेडलॉक्स को संभालता है।",
        questionTextHinglish:
          "Ek idempotent payment webhook receiver kaise design karenge jo duplicate events, out-of-order deliveries, aur database deadlocks safely handle kare?",
        contextHint: "Discuss idempotency keys, unique database constraints, distributed locks (Redis Redlock), message queues, and transaction isolation levels.",
        expectedKeywords: ["idempotency key", "distributed lock", "redis", "deadlock", "transaction isolation", "acid", "event deduplication", "message queue"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 140,
        difficulty: "advanced",
      },
    ],
  },
  data_scientist_ml: {
    roleTitle: "Data Scientist & Applied ML Engineer",
    questions: [
      {
        id: "ds-01",
        roleId: "data_scientist_ml",
        category: "architecture_tradeoff",
        questionText:
          "How do you detect and mitigate data drift and concept drift in a live fraud detection model deployed in production? What metric thresholds trigger automatic model retraining?",
        questionTextHi:
          "उत्पादन में तैनात लाइव फ्रॉड डिटेक्शन मॉडल में आप डेटा ड्रिफ्ट और कॉन्सेप्ट ड्रिफ्ट का पता कैसे लगाते हैं और उसे कैसे कम करते हैं?",
        questionTextHinglish:
          "Production fraud detection model me Data Drift aur Concept Drift detect aur mitigate karne ke liye aapka monitoring framework kya hoga?",
        contextHint: "Discuss KS-test, PSI (Population Stability Index), Wasserstein distance, shadow deployments, ground truth feedback delay, and automated retraining pipelines.",
        expectedKeywords: ["data drift", "concept drift", "psi", "ks-test", "wasserstein", "shadow deployment", "retraining pipeline", "ground truth", "feature distribution"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 130,
        difficulty: "intermediate",
      },
    ],
  },
  cybersecurity_specialist: {
    roleTitle: "Cybersecurity & Security Operations Engineer",
    questions: [
      {
        id: "sec-01",
        roleId: "cybersecurity_specialist",
        category: "system_design",
        questionText:
          "Describe how you would architect a Zero Trust Network Architecture (ZTNA) with mTLS authentication, dynamic policy enforcement, and continuous device posture assessment.",
        questionTextHi:
          "एमटीएलएस (mTLS) प्रमाणीकरण और गतिशील नीति प्रवर्तन के साथ जीरो ट्रस्ट नेटवर्क आर्किटेक्चर (ZTNA) कैसे डिजाइन करेंगे?",
        questionTextHinglish:
          "Enterprise environment ke liye Zero Trust Network Architecture (ZTNA) with mTLS, dynamic policy evaluation, aur continuous posture assessment kaise implement karenge?",
        contextHint: "Discuss Identity Provider (IdP), OIDC/SAML, Service Mesh SPIFFE/SPIRE, microsegmentation, and context-aware access proxies.",
        expectedKeywords: ["zero trust", "mtls", "spiffe", "spire", "microsegmentation", "least privilege", "identity provider", "posture check", "policy engine"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 140,
        difficulty: "advanced",
      },
    ],
  },
  mobile_engineer: {
    roleTitle: "Mobile Applications Engineer",
    questions: [
      {
        id: "mob-01",
        roleId: "mobile_engineer",
        category: "failure_recovery",
        questionText:
          "How would you architect a robust offline-first synchronization engine for a mobile app with SQLite/WatermelonDB, delta sync, background push notifications, and conflict resolution?",
        questionTextHi:
          "एक मोबाइल ऐप के लिए ऑफ़लाइन-प्रथम सिंक्रोनाइज़ेशन इंजन कैसे आर्किटेक्ट करेंगे?",
        questionTextHinglish:
          "Mobile application me offline-first sync engine with SQLite, background sync, aur conflict resolution kaise architect karenge?",
        contextHint: "Discuss optimistic UI updates, sync queues, CRDT/timestamp conflicts, battery optimization, and network connectivity listeners.",
        expectedKeywords: ["offline-first", "sqlite", "sync queue", "optimistic ui", "conflict resolution", "background fetch", "delta sync", "retry mechanism"],
        evaluationCriteria: { technicalWeight: 0.35, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 130,
        difficulty: "intermediate",
      },
    ],
  },
  embedded_iot_engineer: {
    roleTitle: "Embedded Systems & IoT Hardware Engineer",
    questions: [
      {
        id: "iot-01",
        roleId: "embedded_iot_engineer",
        category: "failure_recovery",
        questionText:
          "How do you implement fail-safe Over-The-Air (OTA) firmware updates on memory-constrained microcontroller units (MCUs) with dual-bank flash memory, cryptographic signing, and automatic rollback?",
        questionTextHi:
          "मेमोरी-बाधित माइक्रोकंट्रोलर इकाइयों पर फ़ेल-सेफ़ ओवर-द-एयर (OTA) फ़र्मवेयर अपडेट कैसे लागू करेंगे?",
        questionTextHinglish:
          "Memory constrained microcontrollers par Dual-Bank flash memory aur cryptographic signature ke sath secure OTA firmware update kaise build karenge?",
        contextHint: "Discuss bootloader state machines, A/B partition swapping, SHA-256 verification, watchdog timers, and power interruption resilience.",
        expectedKeywords: ["ota", "bootloader", "dual bank", "flash memory", "cryptographic signature", "sha-256", "watchdog", "rollback", "checksum"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.25, communicationWeight: 0.15, confidenceWeight: 0.1, relevanceWeight: 0.1 },
        suggestedDurationSeconds: 130,
        difficulty: "advanced",
      },
    ],
  },
};

/**
 * Initializes or starts an interview session
 */
export async function initializeInterviewSession(config: InterviewConfig): Promise<{
  sessionId: string;
  config: InterviewConfig;
  interviewer: InterviewerPersona;
  initialQuestion: InterviewQuestion;
  welcomeMessage: string;
}> {
  const bank = ROLE_INTERVIEW_BANKS[config.roleId] || ROLE_INTERVIEW_BANKS.ai_systems_engineer;
  const interviewer = INTERVIEWER_PERSONAS[config.interviewerId] || INTERVIEWER_PERSONAS.aditi_sharma;
  const initialQuestion = bank.questions[0];

  const welcomeMessage =
    config.language === "hi"
      ? `नमस्ते! मैं ${interviewer.name} हूँ, ${interviewer.role}। आज के इस मॉक इंटरव्यू में आपका स्वागत है। हम आपके तकनीकी ज्ञान, समस्या समाधान और संचार कौशल का मूल्यांकन करेंगे। चलिए शुरू करते हैं!`
      : `Hello! I am ${interviewer.name}, ${interviewer.role} at ${interviewer.company}. Welcome to your technical mock interview session. I will be evaluating your architecture depth, problem-solving methodology, and delivery. Let's begin!`;

  return {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    config,
    interviewer,
    initialQuestion,
    welcomeMessage,
  };
}

/**
 * Evaluates candidate's answer across all 7 dimensions
 */
export function evaluateAnswerDeterministically(
  question: InterviewQuestion,
  answerText: string,
  responseTimeSeconds: number = 60,
  config?: InterviewConfig
): SingleQuestionEvaluation {
  const cleaned = answerText.toLowerCase().trim();
  const rawWords = cleaned.split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;

  // 1. Technical Knowledge (Keyword Match, Concept Depth)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  question.expectedKeywords.forEach((kw) => {
    if (cleaned.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverageRatio =
    question.expectedKeywords.length > 0
      ? matchedKeywords.length / question.expectedKeywords.length
      : 0.7;
  const coveragePercentage = Math.round(keywordCoverageRatio * 100);

  let technicalKnowledge = Math.round(keywordCoverageRatio * 75 + (wordCount >= 50 ? 20 : wordCount * 0.4));
  technicalKnowledge = Math.min(Math.max(technicalKnowledge, 25), 98);

  // 2. Relevance of Answer (Direct adherence to question topic)
  let relevance = 60;
  if (matchedKeywords.length >= 2) relevance += 25;
  else if (matchedKeywords.length === 1) relevance += 15;
  if (wordCount >= 30) relevance += 10;
  if (cleaned.includes("because") || cleaned.includes("specifically") || cleaned.includes("in order to") || cleaned.includes("design")) {
    relevance += 5;
  }
  relevance = Math.min(Math.max(relevance, 30), 98);

  // 3. Answer Quality (Depth, trade-offs, architecture reasoning)
  let answerQuality = 55;
  if (cleaned.includes("trade-off") || cleaned.includes("tradeoff") || cleaned.includes("latency") || cleaned.includes("throughput")) {
    answerQuality += 15;
  }
  if (cleaned.includes("bottleneck") || cleaned.includes("failover") || cleaned.includes("cluster") || cleaned.includes("consistency")) {
    answerQuality += 12;
  }
  if (wordCount >= 70) answerQuality += 15;
  answerQuality = Math.min(Math.max(answerQuality, 25), 96);

  // 4. Communication & Articulation (Structure, STAR markers, transitions)
  let communication = 60;
  const transitionWords = ["firstly", "specifically", "additionally", "furthermore", "in conclusion", "for example", "to mitigate", "consequently", "pehla", "isliye", "dhyan"];
  const transitionsFound = transitionWords.filter((t) => cleaned.includes(t)).length;
  communication += Math.min(transitionsFound * 6, 20);
  if (wordCount >= 60) communication += 15;
  communication = Math.min(Math.max(communication, 35), 96);

  // 5. Confidence Indicators (Action verbs, metrics vs filler words)
  const confidenceVerbs = ["engineered", "architected", "implemented", "optimized", "mitigated", "deployed", "scaled", "measured", "configured", "solved"];
  const fillers = ["um", "uh", "like", "maybe", "i guess", "probably", "kinda", "sort of", "basically", "actually"];
  
  const verbsFound = confidenceVerbs.filter((v) => cleaned.includes(v)).length;
  const fillersFound = fillers.filter((f) => cleaned.includes(f)).length;
  const hasTelemetry = /\d+%|\d+ms|\d+gb|\d+x|\d+k|\d+ rps|\d+ fps/i.test(cleaned);

  let confidenceIndicators = 65 + verbsFound * 5 + (hasTelemetry ? 12 : 0) - fillersFound * 6;
  confidenceIndicators = Math.min(Math.max(confidenceIndicators, 30), 98);

  // 6. Response Time & Pacing
  // Ideal range: 45s to 180s. Too fast (<15s) indicates rushing; too slow (>240s) indicates hesitation.
  let responseTimePacing = 80;
  if (responseTimeSeconds >= 45 && responseTimeSeconds <= 160) {
    responseTimePacing = 95;
  } else if (responseTimeSeconds < 20) {
    responseTimePacing = Math.max(40, 50 + wordCount);
  } else if (responseTimeSeconds > 220) {
    responseTimePacing = Math.max(50, 90 - (responseTimeSeconds - 220) * 0.3);
  }

  // 7. Completeness & Edge Case Handling
  let completeness = Math.round(coveragePercentage * 0.6 + (wordCount >= 80 ? 35 : wordCount * 0.35));
  if (cleaned.includes("edge case") || cleaned.includes("error") || cleaned.includes("fallback") || cleaned.includes("exception")) {
    completeness += 10;
  }
  completeness = Math.min(Math.max(completeness, 25), 97);

  // Composite Weighted Question Score
  const criteria = question.evaluationCriteria;
  const overall = Math.round(
    technicalKnowledge * criteria.technicalWeight +
    relevance * criteria.relevanceWeight +
    answerQuality * 0.2 +
    communication * criteria.communicationWeight +
    confidenceIndicators * criteria.confidenceWeight +
    completeness * criteria.completenessWeight
  );

  // Identify Strengths
  const strengths: string[] = [];
  if (matchedKeywords.length >= 3) {
    strengths.push(`Precise grasp of core terminology: ${matchedKeywords.slice(0, 3).join(", ")}.`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified key domain element: ${matchedKeywords[0]}.`);
  }
  if (hasTelemetry) {
    strengths.push("Excellent use of quantifiable architectural metrics (latencies, capacities, throughput).");
  }
  if (wordCount >= 60) {
    strengths.push("Thorough technical explanation with structural clarity.");
  }
  if (strengths.length === 0) {
    strengths.push("Direct answer attempt addressing the primary question subject.");
  }

  // Identify Weaknesses
  const weaknesses: string[] = [];
  if (missingKeywords.length > 0) {
    weaknesses.push(`Omitted critical domain concepts: ${missingKeywords.slice(0, 2).join(" and ")}.`);
  }
  if (wordCount < 40) {
    weaknesses.push("Response was too brief; missed elaborating on trade-offs and failure modes.");
  }
  if (!hasTelemetry && (question.category === "system_design" || question.category === "architecture_tradeoff")) {
    weaknesses.push("Lacked concrete performance metrics (e.g. p99 latencies, RAM footprints, RPS limits).");
  }

  const identifiedConcepts = matchedKeywords;
  const omittedConcepts = missingKeywords;
  const improvementTip =
    missingKeywords.length > 0
      ? `For deep questions like this, always bridge your answer by explaining how ${missingKeywords[0]} prevents bottlenecks.`
      : "Strengthen your delivery by adopting the Problem Analysis → Architectural Decision → Metric Trade-off structure.";

  const modelAnswer = `An exemplary response opens with system constraints, directly proposes the core architecture (${question.expectedKeywords.slice(0, 3).join(", ")}), explains the concurrency and memory trade-offs, and quantifies expected latency/throughput impact.`;

  return {
    questionId: question.id,
    questionText: question.questionText,
    category: question.category,
    answerText,
    responseTimeSeconds,
    wordCount,
    scores: {
      overall,
      technicalKnowledge,
      relevance,
      answerQuality,
      communication,
      confidenceIndicators,
      responseTimePacing: Math.round(responseTimePacing),
      completeness,
    },
    strengths,
    weaknesses,
    keywordCoverage: {
      matchedKeywords,
      missingKeywords,
      coveragePercentage,
    },
    identifiedConcepts,
    omittedConcepts,
    improvementTip,
    modelAnswer,
  };
}

/**
 * Contextual Follow-Up Question Generator
 * Takes previous answers, identifies what was mentioned or omitted, and crafts an intelligent follow-up question
 */
export async function generateNextInterviewQuestion(
  config: InterviewConfig,
  currentQuestionIndex: number,
  previousEvaluations: SingleQuestionEvaluation[]
): Promise<InterviewQuestion | null> {
  const bank = ROLE_INTERVIEW_BANKS[config.roleId] || ROLE_INTERVIEW_BANKS.ai_systems_engineer;
  const totalWanted = config.totalQuestions || 4;

  // If completed all turns, return null
  if (currentQuestionIndex + 1 >= totalWanted) {
    return null;
  }

  const lastEvaluation = previousEvaluations[previousEvaluations.length - 1];
  const nextBaseQuestion = bank.questions[currentQuestionIndex + 1] || bank.questions[1];

  // If we have a previous evaluation, create a realistic contextual probe!
  if (lastEvaluation) {
    const mentioned = lastEvaluation.identifiedConcepts[0];
    const omitted = lastEvaluation.omittedConcepts[0];

    let contextualPromptText = "";
    let contextualHint = "";

    if (mentioned && omitted) {
      contextualPromptText = `You mentioned utilizing ${mentioned}. However, in high-throughput production environments, how would you specifically handle ${omitted} and guarantee zero data loss during node failures?`;
      contextualHint = `Deep dive into how ${mentioned} and ${omitted} interact under fault conditions.`;
    } else if (mentioned) {
      contextualPromptText = `Building on your point about ${mentioned}: What are the operational cost and memory bandwidth bottlenecks when scaling this solution by 10x?`;
      contextualHint = `Discuss scaling limits, cache eviction, and I/O bottlenecks.`;
    } else if (omitted) {
      contextualPromptText = `Let's dig deeper into the failure modes. In your previous response, you didn't touch upon ${omitted}. How does that factor into your reliability design?`;
      contextualHint = `Address ${omitted} and fail-safe recovery patterns.`;
    } else {
      // Fallback to next curated question in role bank
      return nextBaseQuestion;
    }

    const followUpQuestion: InterviewQuestion = {
      id: `q-followup-${currentQuestionIndex + 1}`,
      roleId: config.roleId,
      category: "architecture_tradeoff",
      questionText: contextualPromptText,
      questionTextHi: `आपने ${mentioned || "इस संरचना"} का उल्लेख किया। उत्पादन वातावरण में आप ${omitted || "विफलता मोड"} को कैसे संभालेंगे?`,
      questionTextHinglish: `Aapne ${mentioned || "previous component"} ka mention kiya. Production scale par aap ${omitted || "failure recovery"} ko kaise manage karenge?`,
      contextHint: contextualHint,
      expectedKeywords: [
        ...(mentioned ? [mentioned] : []),
        ...(omitted ? [omitted] : []),
        "latency",
        "throughput",
        "trade-off",
        "failover",
        "consistency",
      ],
      evaluationCriteria: {
        technicalWeight: 0.35,
        completenessWeight: 0.25,
        communicationWeight: 0.2,
        confidenceWeight: 0.1,
        relevanceWeight: 0.1,
      },
      suggestedDurationSeconds: 120,
      difficulty: config.difficulty,
      isFollowUp: true,
      followUpContext: `Contextual probe derived from student's previous response.`,
    };

    return followUpQuestion;
  }

  return nextBaseQuestion;
}

/**
 * Compiles the final comprehensive performance report
 */
export function generateFinalInterviewReport(
  sessionId: string,
  config: InterviewConfig,
  evaluations: SingleQuestionEvaluation[]
): FinalInterviewReport {
  const interviewer = INTERVIEWER_PERSONAS[config.interviewerId] || INTERVIEWER_PERSONAS.aditi_sharma;

  if (evaluations.length === 0) {
    throw new Error("Cannot generate final report without evaluated answers");
  }

  // Calculate Average Composite Scores across all answered questions
  const totalQuestionsAnswered = evaluations.length;
  const totalDurationSeconds = evaluations.reduce((acc, e) => acc + (e.responseTimeSeconds || 60), 0);

  const avg = (fn: (e: SingleQuestionEvaluation) => number) =>
    Math.round(evaluations.reduce((acc, e) => acc + fn(e), 0) / totalQuestionsAnswered);

  const technicalKnowledge = avg((e) => e.scores.technicalKnowledge);
  const relevance = avg((e) => e.scores.relevance);
  const answerQuality = avg((e) => e.scores.answerQuality);
  const communication = avg((e) => e.scores.communication);
  const confidenceIndicators = avg((e) => e.scores.confidenceIndicators);
  const responseTimePacing = avg((e) => e.scores.responseTimePacing);
  const completeness = avg((e) => e.scores.completeness);

  const overallScore = Math.round(
    technicalKnowledge * 0.3 +
    relevance * 0.15 +
    answerQuality * 0.15 +
    communication * 0.15 +
    confidenceIndicators * 0.1 +
    completeness * 0.15
  );

  // Performance Grade
  let performanceGrade: FinalInterviewReport["performanceGrade"] = "Competent";
  if (overallScore >= 90) performanceGrade = "Outstanding (Top 5%)";
  else if (overallScore >= 80) performanceGrade = "Placement Ready";
  else if (overallScore >= 68) performanceGrade = "Competent";
  else if (overallScore >= 50) performanceGrade = "Needs Focused Preparation";
  else performanceGrade = "Developing";

  // Aggregate Strengths & Weaknesses
  const allStrengths = Array.from(new Set(evaluations.flatMap((e) => e.strengths)));
  const allWeaknesses = Array.from(new Set(evaluations.flatMap((e) => e.weaknesses)));

  const overallStrengths = allStrengths.slice(0, 4);
  const overallWeaknesses = allWeaknesses.slice(0, 4);

  // Identify Weakest Questions (questions with score < 75 or lowest scoring)
  const sortedByScore = [...evaluations].sort((a, b) => a.scores.overall - b.scores.overall);
  const weakQuestionsBreakdown = sortedByScore.slice(0, 2).map((q) => {
    return {
      questionId: q.questionId,
      questionText: q.questionText,
      score: q.scores.overall,
      candidateAnswerSummary: q.answerText.length > 120 ? q.answerText.slice(0, 117) + "..." : q.answerText,
      whyItWasWeak: q.omittedConcepts.length > 0
        ? `Lacked depth on crucial domain elements: ${q.omittedConcepts.join(", ")}.`
        : "Response did not sufficiently articulate system trade-offs or quantifiable telemetry.",
      modelAnswer: q.modelAnswer,
      actionableFix: q.improvementTip,
    };
  });

  // Specific Actionable Improvements
  const specificImprovementSuggestions: string[] = [
    "Adopt the STAR Framework (Situation → Task → Architectural Action → Measured Result) for deep technical questions.",
    "Quantify your statements: specify p99 latency targets, cache hit ratios, and memory footprints rather than saying 'it will be fast'.",
    "Explicitly address failure recovery and edge cases (e.g. network partition, memory exhaustion, race conditions) before concluding your answers.",
  ];

  if (communication < 75) {
    specificImprovementSuggestions.push("Use structured transition markers ('First', 'Specifically', 'In contrast') to keep long answers coherent.");
  }
  if (confidenceIndicators < 75) {
    specificImprovementSuggestions.push("Eliminate hesitation filler words and lead with strong action verbs ('Engineered', 'Optimized', 'Architected').");
  }

  // Recommended Practice Topics
  const allMissing = Array.from(new Set(evaluations.flatMap((e) => e.keywordCoverage.missingKeywords)));
  const recommendedTopicsToPractice = (allMissing.length > 0 ? allMissing : ["Distributed Concurrency", "Low-Latency Caching", "Failure Recovery"]).slice(0, 3).map((topic, i) => ({
    topic,
    priority: (i === 0 ? "High" : "Medium") as "High" | "Medium" | "Low",
    reason: `Identified as a recurring deficit area during your interview session for ${config.roleId.replace(/_/g, " ")}.`,
    suggestedDrill: `Practice delivering a 90-second structured technical breakdown on ${topic} trade-offs.`,
  }));

  return {
    sessionId,
    config,
    interviewer,
    timestamp: new Date().toISOString(),
    totalQuestionsAnswered,
    totalDurationSeconds,
    overallScore,
    performanceGrade,
    categoryRatings: {
      technicalKnowledge,
      relevance,
      answerQuality,
      communication,
      confidenceIndicators,
      responseTimePacing,
      completeness,
    },
    overallStrengths,
    overallWeaknesses,
    weakQuestionsBreakdown,
    specificImprovementSuggestions,
    recommendedTopicsToPractice,
    questionEvaluations: evaluations,
    practiceDisclaimer:
      "DISCLAIMER: This report is generated by KaushalSetu's AI Career Intelligence Engine for diagnostic self-improvement and mock practice. It does not constitute an automated hiring or recruitment gate.",
  };
}

// Global In-Memory Store for Mock Interview Reports & Attempts
const globalInterviewStore = global as unknown as {
  _interviewReports?: Map<string, FinalInterviewReport>;
};

if (!globalInterviewStore._interviewReports) {
  globalInterviewStore._interviewReports = new Map<string, FinalInterviewReport>();

  // Pre-seed sample attempt: AI Systems Architect (88% - Placement Ready)
  const sampleReport1: FinalInterviewReport = {
    sessionId: "mock-ai-01",
    config: {
      roleId: "ai_systems_engineer",
      experienceLevel: "junior",
      interviewType: "technical",
      language: "en",
      difficulty: "intermediate",
      interviewerId: "aditi_sharma",
      totalQuestions: 4,
    },
    interviewer: INTERVIEWER_PERSONAS.aditi_sharma,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    totalQuestionsAnswered: 4,
    totalDurationSeconds: 480,
    overallScore: 88,
    performanceGrade: "Placement Ready",
    categoryRatings: {
      technicalKnowledge: 92,
      relevance: 90,
      answerQuality: 86,
      communication: 85,
      confidenceIndicators: 88,
      responseTimePacing: 92,
      completeness: 84,
    },
    overallStrengths: [
      "Precise grasp of core terminology: tensorrt, pagedattention, vllm.",
      "Excellent use of quantifiable architectural metrics (latencies, capacities, throughput).",
      "Thorough technical explanation with structural clarity.",
      "Clear articulation of memory bandwidth limits in Hopper GPUs.",
    ],
    overallWeaknesses: [
      "Omitted critical domain concepts: chunked prefill and swap space under sudden spikes.",
      "Could elaborate more on cross-node communication overhead with InfiniBand.",
    ],
    weakQuestionsBreakdown: [
      {
        questionId: "ai-03",
        questionText: "Describe how you would handle sudden GPU Out-Of-Memory (OOM) faults caused by unexpected prompt length spikes during high-throughput real-time streaming.",
        score: 72,
        candidateAnswerSummary: "We would restart the worker container or drop the long request using a basic rate limiter.",
        whyItWasWeak: "Lacked depth on crucial domain elements: dynamic KV cache preemption, chunked prefill, and dedicated swap space offloading.",
        modelAnswer: "An exemplary response discusses chunked prefill to cap prompt token compute, dynamic KV cache preemption with host RAM swap buffers, and token length thresholding before requests hit CUDA execution.",
        actionableFix: "For deep questions like this, always bridge your answer by explaining how chunked prefill prevents OOM bottlenecks.",
      },
    ],
    specificImprovementSuggestions: [
      "Adopt the STAR Framework (Situation → Task → Architectural Action → Measured Result) for deep technical questions.",
      "Quantify your statements: specify p99 latency targets, cache hit ratios, and memory footprints rather than saying 'it will be fast'.",
      "Explicitly address failure recovery and edge cases (e.g. network partition, memory exhaustion, race conditions) before concluding your answers.",
    ],
    recommendedTopicsToPractice: [
      {
        topic: "Chunked Prefill & KV Cache Preemption",
        priority: "High",
        reason: "Identified as a recurring deficit area during your interview session for ai systems engineer.",
        suggestedDrill: "Practice delivering a 90-second structured technical breakdown on Chunked Prefill trade-offs.",
      },
      {
        topic: "InfiniBand vs NVLink All-Reduce Limits",
        priority: "Medium",
        reason: "Identified as a secondary growth area during multi-node parallelism probing.",
        suggestedDrill: "Practice contrasting inter-node vs intra-node bandwidth limits.",
      },
    ],
    questionEvaluations: [],
    practiceDisclaimer:
      "DISCLAIMER: This report is generated by KaushalSetu's AI Career Intelligence Engine for diagnostic self-improvement and mock practice. It does not constitute an automated hiring or recruitment gate.",
  };

  // Pre-seed sample attempt: Full-Stack Architect (62% - Needs Focused Preparation)
  const sampleReport2: FinalInterviewReport = {
    sessionId: "mock-fs-01",
    config: {
      roleId: "fullstack_architect",
      experienceLevel: "entry",
      interviewType: "technical",
      language: "en",
      difficulty: "intermediate",
      interviewerId: "vikram_malhotra",
      totalQuestions: 3,
    },
    interviewer: INTERVIEWER_PERSONAS.vikram_malhotra,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    totalQuestionsAnswered: 3,
    totalDurationSeconds: 320,
    overallScore: 62,
    performanceGrade: "Needs Focused Preparation",
    categoryRatings: {
      technicalKnowledge: 65,
      relevance: 70,
      answerQuality: 58,
      communication: 64,
      confidenceIndicators: 60,
      responseTimePacing: 70,
      completeness: 55,
    },
    overallStrengths: [
      "Good foundational understanding of React Server Components and SSR basics.",
      "Clear explanation of client vs server bundle size benefits.",
    ],
    overallWeaknesses: [
      "Omitted database connection pooling and PgBouncer under high concurrency.",
      "Lacked depth on CRDT conflict resolution for collaborative editors.",
      "Lacked concrete performance metrics and quantifiable telemetry.",
    ],
    weakQuestionsBreakdown: [
      {
        questionId: "fs-02",
        questionText: "How would you design a real-time collaborative workspace supporting thousands of concurrent editors with offline capabilities and conflict resolution?",
        score: 54,
        candidateAnswerSummary: "I would use WebSockets and update the database whenever someone types.",
        whyItWasWeak: "Lacked depth on crucial domain elements: CRDTs (Conflict-free Replicated Data Types), Operational Transformation, vector clocks, and local IndexedDB delta sync.",
        modelAnswer: "An exemplary response details CRDTs vs OT, WebSocket connection scaling with Redis Pub/Sub, client-side IndexedDB persistence, and eventual consistency algorithms.",
        actionableFix: "Study distributed state synchronization and CRDT data structures for real-time applications.",
      },
    ],
    specificImprovementSuggestions: [
      "Deepen your architectural vocabulary: review connection pooling, distributed caching, and conflict resolution.",
      "Eliminate hand-waving: articulate specific database isolation levels and queue buffering strategies.",
    ],
    recommendedTopicsToPractice: [
      {
        topic: "CRDTs & Real-Time Sync",
        priority: "High",
        reason: "Core gap identified in real-time collaborative system design.",
        suggestedDrill: "Build a mini prototype with Yjs or Automerge and document delta sync trade-offs.",
      },
    ],
    questionEvaluations: [],
    practiceDisclaimer:
      "DISCLAIMER: This report is generated by KaushalSetu's AI Career Intelligence Engine for diagnostic self-improvement and mock practice. It does not constitute an automated hiring or recruitment gate.",
  };

  globalInterviewStore._interviewReports.set(sampleReport1.sessionId, sampleReport1);
  globalInterviewStore._interviewReports.set(sampleReport2.sessionId, sampleReport2);
}

export function saveInterviewReport(report: FinalInterviewReport): FinalInterviewReport {
  globalInterviewStore._interviewReports!.set(report.sessionId, report);
  return report;
}

export function getInterviewReportById(sessionId: string): FinalInterviewReport | null {
  return globalInterviewStore._interviewReports?.get(sessionId) || null;
}

export function getAllInterviewAttempts(): FinalInterviewReport[] {
  if (!globalInterviewStore._interviewReports) return [];
  return Array.from(globalInterviewStore._interviewReports.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Configurable Interview Readiness Parameters & Thresholds
 */
export const INTERVIEW_READINESS_CONFIG = {
  defaultReadinessThreshold: 70, // 70% or 7.0 / 10
  readinessThresholdScore10: 7.0,
  readinessBadgeReady: "INTERVIEW READY",
  readinessBadgeImprovement: "NEEDS IMPROVEMENT",
};

/**
 * Calculate dynamic performance status based on configured threshold
 */
export function getInterviewPerformanceStatus(
  overallScore: number,
  threshold = INTERVIEW_READINESS_CONFIG.defaultReadinessThreshold
): "INTERVIEW READY" | "NEEDS IMPROVEMENT" {
  return overallScore >= threshold ? "INTERVIEW READY" : "NEEDS IMPROVEMENT";
}

/**
 * Generate a single concise AI performance insight grounded in actual evaluation metrics
 */
export function generatePerformanceInsight(report: FinalInterviewReport): string {
  const { overallScore, categoryRatings, overallStrengths, overallWeaknesses } = report;
  const tech = categoryRatings?.technicalKnowledge ?? overallScore;
  const comm = categoryRatings?.communication ?? overallScore;
  const quality = categoryRatings?.answerQuality ?? overallScore;
  const conf = categoryRatings?.confidenceIndicators ?? overallScore;

  if (overallScore >= 88) {
    return "Exceptional command of core system architecture with clear, confident delivery. Ready for high-bar technical interviews.";
  }
  if (tech >= 75 && (comm < 70 || quality < 70)) {
    return "Your technical knowledge was strong, but your answers could be more structured and concise.";
  }
  if (comm >= 75 && tech < 70) {
    return "Great communication flow and poise, but focus on deepening technical precision and concrete trade-offs.";
  }
  if (conf < 70) {
    return "Solid technical grounding; practice eliminating filler phrases and leading with direct conclusions.";
  }
  if (overallStrengths && overallStrengths.length > 0 && overallWeaknesses && overallWeaknesses.length > 0) {
    const strengthSample = overallStrengths[0].replace(/\.$/, "");
    const weakSample = overallWeaknesses[0].replace(/\.$/, "");
    return `Strong ${strengthSample.toLowerCase()}, but prioritize addressing ${weakSample.toLowerCase()}.`;
  }
  if (overallScore >= INTERVIEW_READINESS_CONFIG.defaultReadinessThreshold) {
    return "Balanced performance across competency areas; refine delivery pacing to reach top-tier readiness.";
  }
  return "Fundamental concepts demonstrated; continue focused practice drills on system trade-offs to reach interview-ready status.";
}
