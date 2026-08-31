/**
 * TECH-TITAN AI Mock Interview Engine
 * Problem Statement #26044 (Smart India Hackathon 2026)
 *
 * Implements:
 * - Role-specific technical & scenario question generator
 * - Multi-vector response evaluation (Technical, Communication, Completeness, Confidence)
 * - Deterministic, non-fabricating score computation
 * - Constructive improvement suggestions & model answer synthesis
 * - Explicit practice tool disclaimer
 */

export interface InterviewQuestion {
  id: string;
  roleId: string;
  roleTitle: string;
  category: "system_design" | "architecture_tradeoff" | "failure_recovery" | "project_deep_dive";
  questionText: string;
  contextHint: string;
  expectedKeywords: string[];
  evaluationCriteria: {
    technicalWeight: number;
    completenessWeight: number;
    communicationWeight: number;
    confidenceWeight: number;
  };
}

export interface InterviewEvaluationReport {
  questionId: string;
  roleTitle: string;
  overallPracticeScore: number; // 0 - 100
  metricScores: {
    technicalRelevance: number; // 0 - 100
    communicationClarity: number; // 0 - 100
    completeness: number; // 0 - 100
    confidenceDelivery: number; // 0 - 100
  };
  strengths: string[];
  areasForImprovement: string[];
  keywordCoverage: {
    matchedKeywords: string[];
    missingKeywords: string[];
    coveragePercentage: number;
  };
  modelAnswerSummary: string;
  recommendedDrills: string[];
  practiceDisclaimer: string;
}

export const ROLE_INTERVIEW_BANKS: Record<string, { roleTitle: string; questions: InterviewQuestion[] }> = {
  ai_systems_engineer: {
    roleTitle: "AI Systems Engineer & LLM Infrastructure Architect",
    questions: [
      {
        id: "q-ai-01",
        roleId: "ai_systems_engineer",
        roleTitle: "AI Systems Engineer & LLM Infrastructure Architect",
        category: "system_design",
        questionText:
          "How would you design a distributed inference cluster for serving 70B parameter LLMs to ensure p99 latency stays under 40ms under heavy concurrent traffic?",
        contextHint: "Think about PagedAttention, TensorRT-LLM, model parallelism (tensor vs pipeline), and dynamic request batching.",
        expectedKeywords: ["tensorrt", "pagedattention", "vllm", "tensor parallelism", "dynamic batching", "cuda stream", "kv cache", "gpu memory"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.3, communicationWeight: 0.2, confidenceWeight: 0.1 },
      },
      {
        id: "q-ai-02",
        roleId: "ai_systems_engineer",
        roleTitle: "AI Systems Engineer & LLM Infrastructure Architect",
        category: "architecture_tradeoff",
        questionText:
          "What are the latency and throughput trade-offs between Tensor Parallelism and Pipeline Parallelism during transformer model serving?",
        contextHint: "Contrast inter-GPU all-reduce overhead (NVLink bandwidth) with pipeline bubble idle time across node boundaries.",
        expectedKeywords: ["nvlink", "all-reduce", "pipeline bubble", "inter-node bandwidth", "latency", "throughput", "microbatch"],
        evaluationCriteria: { technicalWeight: 0.45, completenessWeight: 0.25, communicationWeight: 0.2, confidenceWeight: 0.1 },
      },
      {
        id: "q-ai-03",
        roleId: "ai_systems_engineer",
        roleTitle: "AI Systems Engineer & LLM Infrastructure Architect",
        category: "failure_recovery",
        questionText:
          "Describe how you would handle GPU Out-Of-Memory (OOM) faults during sudden prompt length spikes in production.",
        contextHint: "Address dynamic KV cache preemption, chunked prefill, token length thresholds, and graceful request fallback.",
        expectedKeywords: ["kv cache", "preemption", "chunked prefill", "oom", "backoff", "swap space", "graceful degradation"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.3, communicationWeight: 0.2, confidenceWeight: 0.1 },
      },
    ],
  },
  cloud_sre_architect: {
    roleTitle: "Cloud Native SRE & Distributed Systems Architect",
    questions: [
      {
        id: "q-sre-01",
        roleId: "cloud_sre_architect",
        roleTitle: "Cloud Native SRE & Distributed Systems Architect",
        category: "system_design",
        questionText:
          "Design a multi-region active-active Kubernetes infrastructure for high-availability banking services with zero data loss (RPO = 0).",
        contextHint: "Discuss synchronous database replication, Raft consensus, Anycast DNS routing, and distributed circuit breakers.",
        expectedKeywords: ["active-active", "raft", "synchronous replication", "rpo", "rto", "anycast", "istio", "circuit breaker"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.3, communicationWeight: 0.2, confidenceWeight: 0.1 },
      },
      {
        id: "q-sre-02",
        roleId: "cloud_sre_architect",
        roleTitle: "Cloud Native SRE & Distributed Systems Architect",
        category: "failure_recovery",
        questionText:
          "A major AWS region experiences a network partition during peak transaction hours. How does your system isolate faults and prevent cascading failure?",
        contextHint: "Explain exponential backoff with jitter, dead letter queues, rate limiters, and automated traffic re-routing.",
        expectedKeywords: ["network partition", "jitter", "exponential backoff", "dead letter queue", "rate limiting", "failover", "health checks"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.35, communicationWeight: 0.15, confidenceWeight: 0.1 },
      },
    ],
  },
  fullstack_architect: {
    roleTitle: "Full-Stack Web & Systems Architect",
    questions: [
      {
        id: "q-fs-01",
        roleId: "fullstack_architect",
        roleTitle: "Full-Stack Web & Systems Architect",
        category: "architecture_tradeoff",
        questionText:
          "Explain how React Server Components (RSC) change client-server data fetching and hydration compared to traditional client-side rendering with SPAs.",
        contextHint: "Discuss zero-bundle-size server components, streaming HTML with Suspense, and selective sub-tree hydration.",
        expectedKeywords: ["rsc", "server components", "hydration", "streaming", "suspense", "bundle size", "server-side rendering"],
        evaluationCriteria: { technicalWeight: 0.4, completenessWeight: 0.3, communicationWeight: 0.2, confidenceWeight: 0.1 },
      },
    ],
  },
};

/**
 * Generates tailored interview questions for a target role
 */
export async function generateRoleQuestions(roleId: string): Promise<{
  roleTitle: string;
  questions: InterviewQuestion[];
}> {
  const bank = ROLE_INTERVIEW_BANKS[roleId] || ROLE_INTERVIEW_BANKS.ai_systems_engineer;
  return {
    roleTitle: bank.roleTitle,
    questions: bank.questions,
  };
}

/**
 * Evaluates a student's answer using multi-vector deterministic heuristics
 */
export async function evaluateInterviewResponse(
  questionId: string,
  answerText: string
): Promise<InterviewEvaluationReport> {
  // Find question across all banks
  let question: InterviewQuestion | undefined;
  for (const bank of Object.values(ROLE_INTERVIEW_BANKS)) {
    const found = bank.questions.find((q) => q.id === questionId);
    if (found) {
      question = found;
      break;
    }
  }

  if (!question) {
    question = ROLE_INTERVIEW_BANKS.ai_systems_engineer.questions[0];
  }

  const cleanedAnswer = answerText.toLowerCase().trim();
  const wordCount = cleanedAnswer.split(/\s+/).filter(Boolean).length;

  // 1. Technical Relevance (Keyword Match & Terminology)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  question.expectedKeywords.forEach((kw) => {
    if (cleanedAnswer.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverageRatio =
    question.expectedKeywords.length > 0
      ? matchedKeywords.length / question.expectedKeywords.length
      : 0.8;
  const coveragePercentage = Math.round(keywordCoverageRatio * 100);

  let technicalRelevance = Math.round(keywordCoverageRatio * 85 + (wordCount > 40 ? 15 : wordCount * 0.3));
  technicalRelevance = Math.min(Math.max(technicalRelevance, 35), 98);

  // 2. Communication Clarity (Sentence structure, STAR format, transitions)
  let communicationClarity = 65;
  if (wordCount >= 60) communicationClarity += 15;
  if (cleanedAnswer.includes("first") || cleanedAnswer.includes("specifically") || cleanedAnswer.includes("additionally") || cleanedAnswer.includes("trade-off")) {
    communicationClarity += 10;
  }
  if (cleanedAnswer.includes("for example") || cleanedAnswer.includes("in my experience") || cleanedAnswer.includes("result")) {
    communicationClarity += 8;
  }
  communicationClarity = Math.min(Math.max(communicationClarity, 45), 96);

  // 3. Completeness (Handling edge cases and tradeoffs)
  let completeness = Math.round(coveragePercentage * 0.7 + (wordCount > 70 ? 25 : wordCount * 0.25));
  completeness = Math.min(Math.max(completeness, 30), 95);

  // 4. Confidence & Delivery Indicators (Action verbs, metric specificity)
  let confidenceDelivery = 70;
  const confidenceVerbs = ["engineered", "implemented", "optimized", "architected", "ensured", "mitigated", "analyzed", "reduced", "scaled"];
  const matchesVerbs = confidenceVerbs.filter((v) => cleanedAnswer.includes(v)).length;
  confidenceDelivery += matchesVerbs * 6;
  if (/\d+%|\d+ms|\d+gb|\d+x/.test(cleanedAnswer)) {
    confidenceDelivery += 10; // Mentioned quantifiable telemetry
  }
  confidenceDelivery = Math.min(Math.max(confidenceDelivery, 50), 98);

  // 5. Weighted Overall Practice Score
  const criteria = question.evaluationCriteria;
  const overallPracticeScore = Math.round(
    technicalRelevance * criteria.technicalWeight +
    completeness * criteria.completenessWeight +
    communicationClarity * criteria.communicationWeight +
    confidenceDelivery * criteria.confidenceWeight
  );

  // Formulate Strengths
  const strengths: string[] = [];
  if (matchedKeywords.length >= 3) {
    strengths.push(`Strong mastery of core concepts: ${matchedKeywords.slice(0, 3).join(", ")}.`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Correctly identified foundational domain element: ${matchedKeywords[0]}.`);
  }
  if (wordCount >= 50) {
    strengths.push("Well-structured technical narrative with sufficient context elaboration.");
  }
  if (matchesVerbs > 0 || /\d+/.test(cleanedAnswer)) {
    strengths.push("Assertive delivery with quantifiable architectural outcomes.");
  }
  if (strengths.length === 0) {
    strengths.push("Good initial attempt demonstrating willingness to tackle complex architectural questions.");
  }

  // Formulate Areas for Improvement
  const areasForImprovement: string[] = [];
  if (missingKeywords.length > 0) {
    areasForImprovement.push(
      `Deepen explanation of critical components: consider explaining how ${missingKeywords.slice(0, 2).join(" and ")} factor into the solution.`
    );
  }
  if (wordCount < 45) {
    areasForImprovement.push("Expand on failure modes and edge cases (e.g. GPU memory limits, network partition behaviors).");
  }
  if (communicationClarity < 75) {
    areasForImprovement.push("Adopt the Problem → Architecture → Trade-off → Metric Impact response framework.");
  }

  // Formulate Recommended Drills
  const recommendedDrills: string[] = [
    `Review system design patterns for ${question.expectedKeywords.slice(0, 2).join(" and ")}.`,
    "Practice articulating trade-offs between throughput vs latency within 90 seconds.",
    "Draft a 4-bullet architectural summary explaining recovery from cascading failures.",
  ];

  const modelAnswerSummary = `A stellar response clearly identifies the bottleneck, outlines the distributed component layer (${question.expectedKeywords.slice(0, 3).join(", ")}), explains the resource trade-offs, and articulates telemetry monitoring.`;

  return {
    questionId: question.id,
    roleTitle: question.roleTitle,
    overallPracticeScore,
    metricScores: {
      technicalRelevance,
      communicationClarity,
      completeness,
      confidenceDelivery,
    },
    strengths,
    areasForImprovement,
    keywordCoverage: {
      matchedKeywords,
      missingKeywords,
      coveragePercentage,
    },
    modelAnswerSummary,
    recommendedDrills,
    practiceDisclaimer:
      "DISCLAIMER: This is an interactive self-assessment and practice tool designed to help students identify areas for learning. It does NOT constitute an automated hiring or recruitment decision.",
  };
}
