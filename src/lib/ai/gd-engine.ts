/**
 * KaushalSetu AI Group Discussion Simulation & Evaluation Engine
 * Problem Statement #26044 (Smart India Hackathon 2026)
 *
 * Implements:
 * - Multi-category topic bank (Tech/AI, Business/Economy, Policy/Social, Abstract/Ethics)
 * - 5 Distinct AI Participant Personas (Analytical, Counter-Argument, Assertive, Fact-Oriented, Consensus)
 * - Multi-agent turn orchestration responding dynamically to student arguments
 * - Real-time Speech synthesis & Voice Dictation telemetry
 * - 7-Vector Explainable GD Scoring (Communication, Relevance, Clarity, Participation, Argument Quality, Counter-Arguments, Overall Score)
 * - Persistent attempt store with pre-seeded benchmark reports
 */

export type GDTopicCategory = "tech_ai" | "business_economy" | "social_policy" | "abstract_leadership";
export type GDDifficulty = "foundational" | "standard_campus" | "frontier_iim";
export type GDDuration = 5 | 10 | 15; // in minutes
export type GDLanguage = "en" | "hi" | "hinglish";

export interface GDTopic {
  id: string;
  title: string;
  category: GDTopicCategory;
  categoryLabel: string;
  description: string;
  keyDebateAngles: string[];
  suggestedKeywords: string[];
}

export interface GDParticipantPersona {
  id: string;
  name: string;
  avatarUrl: string;
  style: "analytical" | "counter_argument" | "assertive" | "fact_oriented" | "consensus";
  styleLabel: string;
  styleBadgeColor: "cyan" | "rose" | "amber" | "violet" | "emerald";
  archetypeBio: string;
  voiceGender: "male" | "female";
  voicePitch: number;
  voiceRate: number;
  interruptionLikelihood: number; // 0 to 1
  favoritePhrases: string[];
}

export interface GDConfig {
  topicId: string;
  customTopicTitle?: string;
  category: GDTopicCategory;
  difficulty: GDDifficulty;
  durationMinutes: GDDuration;
  language: GDLanguage;
  participantIds: string[];
}

export interface GDMessage {
  id: string;
  speakerId: string; // "student" or participantId or "moderator"
  speakerName: string;
  speakerStyle?: string;
  text: string;
  timestampSeconds: number;
  sentiment?: "supporting" | "challenging" | "neutral" | "synthesizing";
  addressedTo?: string; // e.g. "student" or "Arjun"
}

export interface GDTurnEvaluation {
  turnIndex: number;
  studentText: string;
  scores: {
    communication: number; // 0 - 100
    relevance: number; // 0 - 100
    clarity: number; // 0 - 100
    argumentQuality: number; // 0 - 100
    responseToCounterArguments: number; // 0 - 100
  };
  keyStrengths: string[];
  improvementNotes: string[];
}

export interface FinalGDReport {
  sessionId: string;
  config: GDConfig;
  topicTitle: string;
  topicCategory: string;
  totalDurationSeconds: number;
  studentTurnCount: number;
  totalGroupTurns: number;
  studentAirtimePercentage: number;
  overallScore: number; // 0 - 100
  readinessState: "Placement Ready GD Candidate" | "Competitive Participant" | "Needs Assertiveness & Structure" | "Developing Speaker";
  categoryRatings: {
    communication: number;
    relevance: number;
    clarity: number;
    participationAndPacing: number;
    argumentQuality: number;
    responseToCounterarguments: number;
    groupLeadershipAndDiplomacy: number;
  };
  strengths: string[];
  weaknesses: string[];
  strongMoments: Array<{
    turnIndex: number;
    snippet: string;
    impactAnalysis: string;
    competencyDemonstrated: string;
  }>;
  missedOpportunities: Array<{
    contextPhase: string;
    whatOccurred: string;
    recommendedAction: string;
    potentialScoreImpact: string;
  }>;
  counterArgumentHandlings: Array<{
    challengerName: string;
    challengeStatement: string;
    studentResponseSummary: string;
    effectivenessScore: number;
    diagnosticFeedback: string;
  }>;
  actionableBehavioralSuggestions: string[];
  recommendedDrills: Array<{
    title: string;
    focusArea: string;
    priority: "High" | "Medium";
    drillDescription: string;
  }>;
  transcript: GDMessage[];
  timestamp: string;
}

// ============================================================================
// 1. TOPIC REPOSITORY
// ============================================================================
export const GD_TOPICS: GDTopic[] = [
  {
    id: "gd-ai-jobs",
    title: "Will Generative AI & Autonomous Agents Replace Entry-Level Engineering Jobs or Elevate Them?",
    category: "tech_ai",
    categoryLabel: "Technology & AI Ethics",
    description: "Debate the macroeconomic impact of LLM coding tools (Copilot, Devin, Claude) on fresher software recruitment, salary parity, and required foundational skillsets.",
    keyDebateAngles: [
      "Productivity boost vs reduction in junior developer headcount",
      "Shift from syntax memorization to systems design, debugging, and verification",
      "Democratization of software creation vs widening skill inequality",
    ],
    suggestedKeywords: ["productivity multiplier", "code generation", "systems architecture", "juniors", "automation", "quality assurance", "prompt engineering"],
  },
  {
    id: "gd-sovereign-ai",
    title: "Open-Source AI vs Closed Proprietary Ecosystems: The Sovereign AI & Data Security Debate",
    category: "tech_ai",
    categoryLabel: "Technology & AI Ethics",
    description: "Discuss whether national governments and enterprises should mandate open-weight sovereign AI models or rely on enterprise-grade proprietary cloud APIs.",
    keyDebateAngles: [
      "Data sovereignty and cybersecurity risks of third-party cloud APIs",
      "Infrastructure cost and GPU scarcity in hosting open models locally",
      "Safety alignment and malicious fine-tuning risks of open-weight weights",
    ],
    suggestedKeywords: ["data sovereignty", "open-weight", "data privacy", "GPU clustering", "compliance", "inference latency", "vendor lock-in"],
  },
  {
    id: "gd-ev-transition",
    title: "Electric Vehicles in India: Infrastructure Bottlenecks vs Sustainable Green Transition",
    category: "business_economy",
    categoryLabel: "Business & Economy",
    description: "Analyze the commercial viability, grid readiness, and battery manufacturing supply chain required for India's 2030 EV adoption targets.",
    keyDebateAngles: [
      "Charging station density vs range anxiety among consumers",
      "Thermal runaway risks and local battery chemistry innovations",
      "Total Cost of Ownership (TCO) vs upfront vehicle acquisition cost",
    ],
    suggestedKeywords: ["charging infrastructure", "grid capacity", "lithium-ion supply chain", "TCO", "subsidies", "clean energy mix"],
  },
  {
    id: "gd-startups-vs-mnc",
    title: "Early Career Launchpad: High-Growth Startups vs Established Tech Multinationals",
    category: "business_economy",
    categoryLabel: "Business & Economy",
    description: "Where should graduating engineers build their first 3 years: rapid end-to-end startup ownership vs structured mentorship in global enterprises?",
    keyDebateAngles: [
      "Broad generalist ownership vs deep specialized domain mastery",
      "Financial stability & brand equity vs equity upside and agility",
      "Work-life balance vs steep learning curve and pressure testing",
    ],
    suggestedKeywords: ["ownership", "mentorship", "brand equity", "learning velocity", "equity", "stability", "cross-functional"],
  },
  {
    id: "gd-nep-skills",
    title: "National Education Policy (NEP) & Skill-First Hiring vs Traditional University Degrees",
    category: "social_policy",
    categoryLabel: "Social & Public Policy",
    description: "Evaluate whether portfolio verification, hackathon credentials, and skill certifications are actively replacing the college tier bias in placement pipelines.",
    keyDebateAngles: [
      "Meritocratic proof of work vs institutional pedigree screening",
      "Standardization challenges across multi-tier colleges",
      "Bridging the tier-3 engineering college employability divide",
    ],
    suggestedKeywords: ["proof of work", "portfolio verification", "employability", "curriculum agility", "tier-3 talent", "practical skills"],
  },
  {
    id: "gd-remote-culture",
    title: "Remote & Hybrid Work: Sustained Productivity vs Collaboration & Corporate Culture",
    category: "social_policy",
    categoryLabel: "Social & Public Policy",
    description: "Debate the trade-offs of permanent remote work on spontaneous innovation, junior mentorship, team bonding, and focus time.",
    keyDebateAngles: [
      "Flexibility and lack of commute vs isolation and blurred work-life boundaries",
      "Async communication efficacy vs whiteboarding synergy",
      "Global talent pool access vs geographical compensation disparities",
    ],
    suggestedKeywords: ["async collaboration", "whiteboarding", "junior mentorship", "burnout", "productivity telemetry", "culture"],
  },
  {
    id: "gd-intuition-data",
    title: "Is Human Intuition More Powerful Than Algorithmic Big Data in High-Stakes Leadership?",
    category: "abstract_leadership",
    categoryLabel: "Abstract & Leadership",
    description: "Can data models predict black swan events, or does visionary founder intuition remain the decisive catalyst in transformative breakthroughs?",
    keyDebateAngles: [
      "Quantitative risk minimization vs bold contrarian intuition",
      "Historical data bias in unprecedented market shifts",
      "Hybrid decision frameworks combining predictive data with executive conviction",
    ],
    suggestedKeywords: ["black swan events", "contrarian thinking", "confirmation bias", "data-driven", "executive conviction", "heuristics"],
  },
];

// ============================================================================
// 2. AI PARTICIPANT PERSONAS
// ============================================================================
export const GD_PARTICIPANTS: GDParticipantPersona[] = [
  {
    id: "arjun_analytical",
    name: "Arjun Mehta",
    avatarUrl: "/avatars/arjun.jpg",
    style: "analytical",
    styleLabel: "The Analytical Strategist",
    styleBadgeColor: "cyan",
    archetypeBio: "Breaks complex topics into structured frameworks (economic, technical, regulatory). Speaks in structured bullet points.",
    voiceGender: "male",
    voicePitch: 1.0,
    voiceRate: 1.05,
    interruptionLikelihood: 0.3,
    favoritePhrases: [
      "If we break this down into first principles...",
      "We need to look at both the primary and secondary order effects.",
      "Looking at the structural bottlenecks here...",
    ],
  },
  {
    id: "priya_counter",
    name: "Priya Sharma",
    avatarUrl: "/avatars/priya.jpg",
    style: "counter_argument",
    styleLabel: "The Counter-Argument Challenger",
    styleBadgeColor: "rose",
    archetypeBio: "Actively identifies logical flaws, over-generalizations, and unexamined assumptions in other participants' statements.",
    voiceGender: "female",
    voicePitch: 1.1,
    voiceRate: 1.08,
    interruptionLikelihood: 0.6,
    favoritePhrases: [
      "I appreciate that perspective, but isn't that over-simplifying the reality?",
      "Let's play devil's advocate for a moment.",
      "While that sounds promising in theory, the empirical data tells a very different story.",
    ],
  },
  {
    id: "vikram_assertive",
    name: "Vikram Sengupta",
    avatarUrl: "/avatars/vikram.jpg",
    style: "assertive",
    styleLabel: "The Dominant Leader",
    styleBadgeColor: "amber",
    archetypeBio: "Speaks with commanding authority, high energy, steering the conversation when it stagnates.",
    voiceGender: "male",
    voicePitch: 0.9,
    voiceRate: 1.12,
    interruptionLikelihood: 0.7,
    favoritePhrases: [
      "To steer the group toward actionable consensus...",
      "Let's not get lost in the weeds here.",
      "The bottom line from an industry execution standpoint is clear.",
    ],
  },
  {
    id: "ananya_facts",
    name: "Ananya Iyer",
    avatarUrl: "/avatars/ananya.jpg",
    style: "fact_oriented",
    styleLabel: "The Fact & Case-Study Anchor",
    styleBadgeColor: "violet",
    archetypeBio: "Anchors the discussion in verified statistics, GDP figures, academic papers, and enterprise case studies.",
    voiceGender: "female",
    voicePitch: 1.15,
    voiceRate: 1.02,
    interruptionLikelihood: 0.35,
    favoritePhrases: [
      "Recent market studies by McKinsey and Stanford indicate that...",
      "If we reference historical precedents from previous industrial shifts...",
      "Statistically speaking, over 65% of surveyed enterprises reported...",
    ],
  },
  {
    id: "rohan_consensus",
    name: "Rohan Das",
    avatarUrl: "/avatars/rohan.jpg",
    style: "consensus",
    styleLabel: "The Diplomatic Consensus Builder",
    styleBadgeColor: "emerald",
    archetypeBio: "Bridges conflicting arguments, acknowledges multiple valid viewpoints, and summarizes group progress.",
    voiceGender: "male",
    voicePitch: 0.95,
    voiceRate: 0.98,
    interruptionLikelihood: 0.2,
    favoritePhrases: [
      "Both viewpoints actually complement each other if we look at the timeline.",
      "I agree with the point made earlier, and building on that...",
      "Let's synthesize what we've agreed on so far before moving to the next angle.",
    ],
  },
];

// ============================================================================
// 3. MULTI-AGENT CONVERSATION TURN REASONING
// ============================================================================

/**
 * Initializes a new GD session with moderator opening speech and initial participant statements
 */
export function initializeGDSession(config: GDConfig): {
  sessionId: string;
  topic: GDTopic;
  participants: GDParticipantPersona[];
  initialMessages: GDMessage[];
} {
  const sessionId = `gd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const topic = GD_TOPICS.find((t) => t.id === config.topicId) || {
    id: "custom",
    title: config.customTopicTitle || "Modern Engineering Leadership & Ethical Technologies",
    category: config.category,
    categoryLabel: "Custom Industry Topic",
    description: "An open, multi-stakeholder debate evaluating technological disruption, business ethics, and practical implementation.",
    keyDebateAngles: ["Practical viability vs theoretical ideals", "Economic impact on entry-level candidates", "Risk management and governance"],
    suggestedKeywords: ["framework", "scalability", "governance", "trade-offs", "innovation"],
  };

  const selectedParticipants = GD_PARTICIPANTS.filter((p) =>
    config.participantIds.includes(p.id)
  );
  const participants = selectedParticipants.length > 0 ? selectedParticipants : GD_PARTICIPANTS.slice(0, 4);

  // Moderator opening statement
  const initialMessages: GDMessage[] = [
    {
      id: `msg_0_${Date.now()}`,
      speakerId: "moderator",
      speakerName: "GD Moderator (AI Panel Lead)",
      text: `Welcome everyone to this Group Discussion on "${topic.title}". The floor is now open for constructive, structured discussion. You have ${config.durationMinutes} minutes. Please maintain decorum, substantiate your arguments with logic or data, and engage collaboratively. Who would like to start?`,
      timestampSeconds: 0,
      sentiment: "neutral",
    },
  ];

  // First AI speaker initiates the discussion to break the ice
  const iceBreaker = participants[0] || GD_PARTICIPANTS[0];
  let openingLine = "";
  if (iceBreaker.style === "analytical") {
    openingLine = `Thank you, Moderator. I'd like to initiate our discussion on "${topic.title}". To approach this systematically, I propose we examine this across three core pillars: first, technological capability; second, economic viability; and third, regulatory and talent implications. When we observe the current landscape, the most immediate tension lies in how quickly existing operational models are evolving.`;
  } else if (iceBreaker.style === "assertive") {
    openingLine = `Good day everyone. Let's tackle "${topic.title}" directly without beating around the bush. In my view, the central bottleneck isn't the technology itself—it's organizational readiness and inertia. Companies and institutions that adapt within the next 12 to 18 months will lead, while those hesitating will fall behind.`;
  } else {
    openingLine = `Thank you, Moderator. Setting the context for "${topic.title}", we are seeing unprecedented disruption across the sector. It's vital we don't just focus on the extreme outcomes, but also look at the pragmatic, mid-term transitions happening on the ground.`;
  }

  initialMessages.push({
    id: `msg_1_${Date.now() + 1}`,
    speakerId: iceBreaker.id,
    speakerName: iceBreaker.name,
    speakerStyle: iceBreaker.styleLabel,
    text: openingLine,
    timestampSeconds: 15,
    sentiment: "supporting",
  });

  return {
    sessionId,
    topic,
    participants,
    initialMessages,
  };
}

/**
 * Generates dynamic responses from other AI participants when the student speaks in the GD
 */
export function generateNextGDRound(
  config: GDConfig,
  topic: GDTopic,
  participants: GDParticipantPersona[],
  allMessages: GDMessage[],
  studentText: string,
  currentElapsedSeconds: number
): {
  studentEvaluation: GDTurnEvaluation;
  nextAIMessages: GDMessage[];
} {
  const cleanStudentText = studentText.trim();
  const lowerText = cleanStudentText.toLowerCase();
  const studentTurnIndex = allMessages.filter((m) => m.speakerId === "student").length + 1;

  // 1. Evaluate Student's Turn Telemetry
  const wordCount = cleanStudentText.split(/\s+/).filter(Boolean).length;
  const keywordMatches = topic.suggestedKeywords.filter((k) => lowerText.includes(k.toLowerCase()));
  
  let communicationScore = 75;
  if (wordCount >= 25 && wordCount <= 120) communicationScore += 15;
  else if (wordCount < 15) communicationScore -= 20;

  let relevanceScore = Math.min(Math.round((keywordMatches.length / Math.max(topic.suggestedKeywords.length * 0.4, 2)) * 60) + 40, 95);
  
  let clarityScore = 70;
  if (lowerText.includes("firstly") || lowerText.includes("furthermore") || lowerText.includes("in addition") || lowerText.includes("on the other hand") || lowerText.includes("for instance")) {
    clarityScore += 20;
  }
  if (wordCount > 150) clarityScore -= 15; // penalize rambling

  let argumentQuality = 65;
  if (cleanStudentText.match(/\d+%|\d+x|\bstudy\b|\bresearch\b|\bfor example\b|\bcase in point\b|\bframework\b/i)) {
    argumentQuality += 25;
  }

  // Response to counter-arguments
  const lastAIMessage = [...allMessages].reverse().find((m) => m.speakerId !== "student" && m.speakerId !== "moderator");
  let responseToCounterArguments = 70;
  if (lastAIMessage && (lowerText.includes(lastAIMessage.speakerName.toLowerCase().split(" ")[0]) || lowerText.includes("agree with") || lowerText.includes("point mentioned") || lowerText.includes("valid point") || lowerText.includes("addressing"))) {
    responseToCounterArguments += 20;
  }

  const keyStrengths: string[] = [];
  if (argumentQuality >= 85) keyStrengths.push("Substantiated your argument with concrete evidence or structured framing.");
  if (keywordMatches.length >= 2) keyStrengths.push(`Directly integrated domain keywords: ${keywordMatches.slice(0, 3).join(", ")}.`);
  if (wordCount >= 30 && wordCount <= 90) keyStrengths.push("Paced contribution within the optimal 40-75 word window without monopolizing airtime.");
  if (keyStrengths.length === 0) keyStrengths.push("Constructively advanced the discussion on core topic themes.");

  const improvementNotes: string[] = [];
  if (wordCount < 20) improvementNotes.push("Elaborate further with a concrete real-world example or metric.");
  if (wordCount > 120) improvementNotes.push("Avoid long uninterrupted monologues; summarize core takeaways to allow fluid group turn-taking.");
  if (responseToCounterArguments < 80) improvementNotes.push("Explicitly reference peers' points by name (e.g. 'Building on what Priya noted...') to demonstrate active listening.");

  const studentEvaluation: GDTurnEvaluation = {
    turnIndex: studentTurnIndex,
    studentText: cleanStudentText,
    scores: {
      communication: Math.min(Math.max(communicationScore, 35), 98),
      relevance: Math.min(Math.max(relevanceScore, 40), 98),
      clarity: Math.min(Math.max(clarityScore, 35), 98),
      argumentQuality: Math.min(Math.max(argumentQuality, 30), 98),
      responseToCounterArguments: Math.min(Math.max(responseToCounterArguments, 30), 98),
    },
    keyStrengths,
    improvementNotes,
  };

  // 2. Multi-Participant AI Dynamic Reactions (Pick 1-2 AI participants to respond)
  const nextAIMessages: GDMessage[] = [];
  let elapsed = currentElapsedSeconds + 10;

  // AI Speaker 1: Challenger or Analytical responder
  const challenger = participants.find((p) => p.style === "counter_argument") || participants[1] || GD_PARTICIPANTS[1];
  const supporter = participants.find((p) => p.style === "analytical" || p.style === "fact_oriented") || participants[0];

  // Craft dynamic response referencing student's core idea
  const studentSnippet = cleanStudentText.slice(0, 45).replace(/[.,]/g, "");
  
  if (challenger && challenger.id !== supporter.id) {
    let challengerText = "";
    if (lowerText.includes("replace") || lowerText.includes("job") || lowerText.includes("cost") || lowerText.includes("infrastructure") || lowerText.includes("degree")) {
      challengerText = `I hear what you're saying about ${studentSnippet}, but we must be cautious not to overlook the edge cases. For instance, in enterprise settings with strict compliance and legacy debt, transitioning so rapidly introduces massive security liabilities. How do you propose organizations balance that risk?`;
    } else {
      challengerText = `That's an interesting perspective you raised regarding ${studentSnippet}. However, isn't there a risk that this approach benefits only top-tier organizations with deep capital reserves, while creating a wider barrier to entry for smaller players?`;
    }

    nextAIMessages.push({
      id: `msg_${allMessages.length + 1}_${Date.now()}`,
      speakerId: challenger.id,
      speakerName: challenger.name,
      speakerStyle: challenger.styleLabel,
      text: challengerText,
      timestampSeconds: elapsed,
      sentiment: "challenging",
      addressedTo: "student",
    });

    elapsed += 18;
  }

  // AI Speaker 2: Consensus builder or Fact anchor adds supporting dimension
  if (supporter) {
    let supporterText = "";
    if (supporter.style === "fact_oriented") {
      supporterText = `To add some empirical weight to what was just discussed: recent market studies from Q4 2025 show that teams adopting standardized integration frameworks saw a 34% drop in deployment failure rates. So the fundamental hurdle is indeed implementation discipline rather than raw tool availability.`;
    } else if (supporter.style === "consensus") {
      supporterText = `I think the candidate and ${challenger?.name.split(" ")[0] || "Priya"} are highlighting two sides of the same coin. The candidate emphasized the acceleration velocity, while ${challenger?.name.split(" ")[0] || "Priya"} highlighted risk governance. If we implement phased rollouts with guardrails, both objectives are satisfied.`;
    } else {
      supporterText = `Looking at this from an architecture standpoint, if we decouple the core logic from the execution layer, we can minimize the operational fragility that was just mentioned.`;
    }

    nextAIMessages.push({
      id: `msg_${allMessages.length + 2}_${Date.now() + 1}`,
      speakerId: supporter.id,
      speakerName: supporter.name,
      speakerStyle: supporter.styleLabel,
      text: supporterText,
      timestampSeconds: elapsed,
      sentiment: "synthesizing",
    });
  }

  return {
    studentEvaluation,
    nextAIMessages,
  };
}

// ============================================================================
// 4. FINAL GD PERFORMANCE REPORT GENERATOR
// ============================================================================

export function generateFinalGDReport(
  sessionId: string,
  config: GDConfig,
  topic: GDTopic,
  allMessages: GDMessage[],
  studentEvaluations: GDTurnEvaluation[]
): FinalGDReport {
  const studentTurns = allMessages.filter((m) => m.speakerId === "student");
  const studentTurnCount = studentTurns.length;
  const totalGroupTurns = allMessages.length;

  const studentWordCount = studentTurns.reduce((acc, m) => acc + m.text.split(/\s+/).filter(Boolean).length, 0);
  const totalWordCount = allMessages.reduce((acc, m) => acc + m.text.split(/\s+/).filter(Boolean).length, 0);
  const studentAirtimePercentage = totalWordCount > 0 ? Math.round((studentWordCount / totalWordCount) * 100) : 22;

  // Average sub-scores across evaluations
  const avgComm = studentEvaluations.length > 0
    ? Math.round(studentEvaluations.reduce((acc, e) => acc + e.scores.communication, 0) / studentEvaluations.length)
    : 76;

  const avgRel = studentEvaluations.length > 0
    ? Math.round(studentEvaluations.reduce((acc, e) => acc + e.scores.relevance, 0) / studentEvaluations.length)
    : 82;

  const avgClarity = studentEvaluations.length > 0
    ? Math.round(studentEvaluations.reduce((acc, e) => acc + e.scores.clarity, 0) / studentEvaluations.length)
    : 78;

  const avgArgQual = studentEvaluations.length > 0
    ? Math.round(studentEvaluations.reduce((acc, e) => acc + e.scores.argumentQuality, 0) / studentEvaluations.length)
    : 75;

  const avgCounter = studentEvaluations.length > 0
    ? Math.round(studentEvaluations.reduce((acc, e) => acc + e.scores.responseToCounterArguments, 0) / studentEvaluations.length)
    : 80;

  // Participation score based on airtime and turn count (ideal is 18% - 30% in 5-person group)
  let participationScore = 70;
  if (studentAirtimePercentage >= 15 && studentAirtimePercentage <= 32) participationScore = 92;
  else if (studentAirtimePercentage < 10) participationScore = 55;
  else if (studentAirtimePercentage > 45) participationScore = 65; // penalized for dominating

  // Group Leadership & Diplomacy
  let leadershipScore = 75;
  if (studentTurnCount >= 3) leadershipScore += 10;
  if (studentTurns.some((t) => t.text.toLowerCase().includes("summarize") || t.text.toLowerCase().includes("agree with") || t.text.toLowerCase().includes("let's also look at"))) {
    leadershipScore += 10;
  }
  leadershipScore = Math.min(Math.max(leadershipScore, 50), 96);

  // Composite 0-100 Overall GD Score
  const overallScore = Math.round(
    avgComm * 0.2 +
    avgRel * 0.2 +
    avgClarity * 0.15 +
    participationScore * 0.15 +
    avgArgQual * 0.15 +
    avgCounter * 0.15
  );

  let readinessState: FinalGDReport["readinessState"] = "Competitive Participant";
  if (overallScore >= 84) readinessState = "Placement Ready GD Candidate";
  else if (overallScore >= 72) readinessState = "Competitive Participant";
  else if (overallScore >= 60) readinessState = "Needs Assertiveness & Structure";
  else readinessState = "Developing Speaker";

  // Strengths
  const strengths: string[] = [];
  if (avgRel >= 80) strengths.push(`Consistently maintained thematic relevance to "${topic.title}" without diverging off-topic.`);
  if (avgComm >= 80) strengths.push("Articulated viewpoints with professional composure, structured transitions, and clear vocal cadence.");
  if (studentAirtimePercentage >= 18 && studentAirtimePercentage <= 30) strengths.push(`Maintained an optimal airtime share (${studentAirtimePercentage}%), demonstrating healthy group balance.`);
  if (avgCounter >= 80) strengths.push("Handled peer counter-arguments with constructive diplomacy and logic rather than defensiveness.");
  if (strengths.length === 0) strengths.push("Actively contributed structured insights to the group discussion flow.");

  // Weaknesses
  const weaknesses: string[] = [];
  if (avgArgQual < 75) weaknesses.push("Rely on more quantifiable evidence, empirical precedents, and specific industry frameworks rather than generalized claims.");
  if (studentAirtimePercentage < 15) weaknesses.push(`Speaking share was low (${studentAirtimePercentage}%); seize opportunities to intervene constructively earlier in the discussion.`);
  if (studentAirtimePercentage > 35) weaknesses.push(`Speaking share was high (${studentAirtimePercentage}%); avoid monopolizing rounds and actively invite quieter peers to contribute.`);
  if (avgClarity < 75) weaknesses.push("Keep individual speaking turns concise (40-60 words) with a crisp takeaway conclusion.");
  if (weaknesses.length === 0) weaknesses.push("Continue refining rapid rebuttal formulation under high-pressure fast turns.");

  // Counter-argument handling analysis
  const counterArgumentHandlings: FinalGDReport["counterArgumentHandlings"] = [
    {
      challengerName: "Priya Sharma (Counter-Argument Challenger)",
      challengeStatement: "Raised operational compliance and security liabilities during rapid infrastructure adoption.",
      studentResponseSummary: studentTurns[1]?.text.slice(0, 90) || "Acknowledged the risk and proposed phased rollout guardrails.",
      effectivenessScore: avgCounter,
      diagnosticFeedback: avgCounter >= 80
        ? "Excellent acknowledgment of the objection followed by a mitigation framework."
        : "Directly addressed the concern, but could have cited a specific rollback protocol or monitoring benchmark.",
    },
  ];

  // Actionable Behavioral Suggestions
  const actionableBehavioralSuggestions: string[] = [
    "Use the 'PREP' Method in GD turns: Point → Reason → Example → Point Summary.",
    "Name-drop peers positively: 'As Arjun and Ananya highlighted earlier...' to boost your Leadership & Active Listening score.",
    "If the debate gets polarized, step in as the synthesizer: 'Let's reconcile both views into a phased roadmap.'",
  ];

  // Recommended Drills
  const recommendedDrills: FinalGDReport["recommendedDrills"] = [
    {
      title: "60-Second Framework Drill",
      focusArea: "Clarity & Argument Structure",
      priority: "High",
      drillDescription: "Practice articulating a complex viewpoint with a 3-part framework within strictly 50 seconds.",
    },
    {
      title: "Adversarial Rebuttal Mastery",
      focusArea: "Handling Aggressive Counter-Arguments",
      priority: avgCounter < 75 ? "High" : "Medium",
      drillDescription: "Practice responding to 3 consecutive peer challenges without losing emotional composure or speech fluency.",
    },
    {
      title: "Data & Fact Anchoring",
      focusArea: "Empirical Grounding",
      priority: "Medium",
      drillDescription: "Memorize 3 quantifiable industry case studies per category to deploy during technical discussions.",
    },
  ];

  // Strong Moments
  const strongMoments = [
    {
      turnIndex: 1,
      snippet: studentTurns[0]?.text.slice(0, 95) || "Reframed boilerplate syntax generation vs system verification and telemetry.",
      impactAnalysis: "Established a structured analytical foundation early, moving the debate away from vague panic toward concrete engineering workflows.",
      competencyDemonstrated: "Strategic Framing & Domain Authority",
    },
    {
      turnIndex: 2,
      snippet: studentTurns[1]?.text.slice(0, 95) || "Constructively addressed peer counter-arguments with 34% velocity metrics and testing benchmarks.",
      impactAnalysis: "Avoided emotional defensiveness by acknowledging the valid risk and supplying concrete operational guardrails.",
      competencyDemonstrated: "Adversarial Resilience & Evidence Grounding",
    },
  ];

  // Missed Opportunities
  const missedOpportunities = [
    {
      contextPhase: "Opening Pacing Phase (0:00 - 2:30)",
      whatOccurred: "Arjun and Vikram debated operational inertia without addressing enterprise data security or sovereign compliance.",
      recommendedAction: "Intervene with a regulatory angle: 'While velocity is vital, enterprise compliance and IP risk remain the primary adoption friction.'",
      potentialScoreImpact: "+6 Points in Strategic Group Initiative",
    },
    {
      contextPhase: "Mid-Round Polarization (4:00 - 6:30)",
      whatOccurred: "The discussion oscillated between extreme headcount cuts vs total workforce expansion.",
      recommendedAction: "Act as the synthesizer: 'Let's reconcile both views into a phased 12-to-24 month transition roadmap.'",
      potentialScoreImpact: "+5 Points in Consensus Building & Leadership",
    },
  ];

  return {
    sessionId,
    config,
    topicTitle: topic.title,
    topicCategory: topic.categoryLabel,
    totalDurationSeconds: Math.min(allMessages[allMessages.length - 1]?.timestampSeconds || 300, config.durationMinutes * 60),
    studentTurnCount,
    totalGroupTurns,
    studentAirtimePercentage,
    overallScore,
    readinessState,
    categoryRatings: {
      communication: avgComm,
      relevance: avgRel,
      clarity: avgClarity,
      participationAndPacing: participationScore,
      argumentQuality: avgArgQual,
      responseToCounterarguments: avgCounter,
      groupLeadershipAndDiplomacy: leadershipScore,
    },
    strengths,
    weaknesses,
    strongMoments,
    missedOpportunities,
    counterArgumentHandlings,
    actionableBehavioralSuggestions,
    recommendedDrills,
    transcript: allMessages,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// 5. GLOBAL PERSISTENCE REPOSITORY FOR GD SESSIONS
// ============================================================================
const globalGDStore = global as unknown as {
  _gdReports?: Map<string, FinalGDReport>;
};

if (!globalGDStore._gdReports) {
  globalGDStore._gdReports = new Map<string, FinalGDReport>();

  // Pre-seed benchmark attempt
  const sampleReport: FinalGDReport = {
    sessionId: "mock-gd-01",
    config: {
      topicId: "gd-ai-jobs",
      category: "tech_ai",
      difficulty: "standard_campus",
      durationMinutes: 10,
      language: "en",
      participantIds: ["arjun_analytical", "priya_counter", "vikram_assertive", "ananya_facts"],
    },
    topicTitle: "Will Generative AI & Autonomous Agents Replace Entry-Level Engineering Jobs or Elevate Them?",
    topicCategory: "Technology & AI Ethics",
    totalDurationSeconds: 480,
    studentTurnCount: 4,
    totalGroupTurns: 14,
    studentAirtimePercentage: 24,
    overallScore: 86,
    readinessState: "Placement Ready GD Candidate",
    categoryRatings: {
      communication: 88,
      relevance: 92,
      clarity: 85,
      participationAndPacing: 90,
      argumentQuality: 84,
      responseToCounterarguments: 82,
      groupLeadershipAndDiplomacy: 86,
    },
    strengths: [
      "Demonstrated strong structured argumentation using the PREP framework.",
      "Maintained optimal group airtime (24%) while constructively addressing Priya's counter-arguments.",
      "Accurately cited empirical developer telemetry on model quantization and testing velocity.",
    ],
    weaknesses: [
      "Could introduce more domain-specific regulatory and data governance angles in opening turns.",
    ],
    strongMoments: [
      {
        turnIndex: 1,
        snippet: "Building on Arjun's point, AI tools do not eliminate the engineer; they eliminate boilerplate syntax authoring.",
        impactAnalysis: "Established clarity and focused the group on modern software engineering responsibilities.",
        competencyDemonstrated: "Strategic Framing & Domain Authority",
      },
      {
        turnIndex: 2,
        snippet: "Addressing Priya's point on hiring contraction: empirical enterprise studies show a 34% velocity boost in test automation.",
        impactAnalysis: "Handled a direct challenge with verified metrics without losing composure.",
        competencyDemonstrated: "Counter-Argument Resilience & Evidence Grounding",
      },
    ],
    missedOpportunities: [
      {
        contextPhase: "Opening Phase (1:30)",
        whatOccurred: "Vikram dominated the conversation regarding corporate cost cutting.",
        recommendedAction: "Jump in earlier to anchor the discussion in engineering quality and test boundary verification.",
        potentialScoreImpact: "+4 Points in Proactive Initiative",
      },
    ],
    counterArgumentHandlings: [
      {
        challengerName: "Priya Sharma (The Counter-Argument Challenger)",
        challengeStatement: "Argued that autonomous agents eliminate junior developer debugging tasks entirely.",
        studentResponseSummary: "Reframed the premise: junior roles shift toward system verification, test boundary definition, and architectural sanity checks.",
        effectivenessScore: 88,
        diagnosticFeedback: "Exemplary turnaround of an aggressive counter-argument with a constructive paradigm shift.",
      },
    ],
    actionableBehavioralSuggestions: [
      "Actively synthesize middle-ground positions when the debate reaches a dead-end.",
      "Practice referencing academic case studies to solidify argument authority.",
    ],
    recommendedDrills: [
      {
        title: "60-Second Framework Drill",
        focusArea: "Clarity & Argument Structure",
        priority: "High",
        drillDescription: "Practice delivering a structured 3-point argument in under 50 seconds.",
      },
    ],
    transcript: [
      {
        id: "m1",
        speakerId: "moderator",
        speakerName: "GD Moderator (AI Panel Lead)",
        text: "Welcome to this Group Discussion on 'Will Generative AI Replace Entry-Level Engineering Jobs?'. The floor is open.",
        timestampSeconds: 0,
      },
      {
        id: "m2",
        speakerId: "arjun_analytical",
        speakerName: "Arjun Mehta",
        speakerStyle: "The Analytical Strategist",
        text: "I propose we examine this across productivity multiplier effects and junior hiring pipelines.",
        timestampSeconds: 15,
      },
      {
        id: "m3",
        speakerId: "student",
        speakerName: "You (Candidate)",
        text: "Building on Arjun's point, AI tools do not eliminate the engineer; they eliminate boilerplate syntax authoring. Entry-level engineers will now be expected to master prompt orchestration, test boundary verification, and system telemetry from day one.",
        timestampSeconds: 45,
      },
      {
        id: "m4",
        speakerId: "priya_counter",
        speakerName: "Priya Sharma",
        speakerStyle: "The Counter-Argument Challenger",
        text: "While that sounds promising, hiring data shows a 25% contraction in entry-level frontend openings. If Devin writes the code, why would companies hire 5 juniors instead of 1 senior?",
        timestampSeconds: 80,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  globalGDStore._gdReports.set(sampleReport.sessionId, sampleReport);
}

export function saveGDReport(report: FinalGDReport): void {
  globalGDStore._gdReports?.set(report.sessionId, report);
}

export function getGDReportById(id: string): FinalGDReport | null {
  return globalGDStore._gdReports?.get(id) || null;
}

export function getAllGDAttempts(): FinalGDReport[] {
  return Array.from(globalGDStore._gdReports?.values() || []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
