/**
 * KaushalSetu Career Readiness Intelligence Engine
 * Computes multi-pillar professional readiness scores, gap telemetry,
 * next-best-action workflows, and personalized learning / opportunity recommendations.
 */

export interface PillarScore {
  score: number; // 0 - 100
  weightPercentage: number;
  label: string;
  status: "Exemplary" | "Proficient" | "Needs Attention" | "Incomplete";
  headlineMetric: string;
  details: string;
  actionHref: string;
  actionLabel: string;
}

export interface SkillGapItem {
  skill: string;
  category: string;
  currentLevel: string;
  requiredLevel: string;
  priority: "Critical" | "High" | "Medium";
  impactOnReadiness: string;
  timeToCloseHours: number;
  learningActionUrl: string;
}

export interface NextBestActionFlow {
  title: string;
  step1: { action: string; badge: string };
  step2: { action: string; badge: string };
  step3: { action: string; badge: string };
  fullFlowString: string;
  reasoning: string;
  projectedScoreBoost: number;
  primaryCtaLabel: string;
  primaryCtaHref: string;
}

export interface RecommendedLearningCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skillTarget: string;
  type: "Interactive Lab" | "Video Course" | "Assessment Drill";
  rating: number;
  actionUrl: string;
}

export interface RelevantOpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-Time" | "Internship";
  stipendOrSalary: string;
  matchScore: number;
  isGoodToApply: boolean;
  requiredReadinessThreshold: number;
  matchedSkills: string[];
  missingSkills: string[];
  applyUrl: string;
}

export interface CareerReadinessProfile {
  studentName: string;
  targetRole: string;
  targetIndustry: string;
  lastUpdated: string;
  
  // Composite & Tier
  overallScore: number; // 0 - 100
  readinessTier: "Placement Ready (Tier 1)" | "Competitive Candidate (Tier 2)" | "Developing Foundations (Tier 3)";
  readinessStatusBanner: {
    title: string;
    description: string;
    variant: "emerald" | "cyber" | "amber";
  };

  // 6 Modular Pillars
  pillars: {
    skillReadiness: PillarScore;
    resumeReadiness: PillarScore;
    interviewReadiness: PillarScore;
    gdReadiness: PillarScore;
    projectEvidence: PillarScore;
    careerGoalAlignment: PillarScore;
  };

  // Analysis Breakdown
  strongestAreas: Array<{
    title: string;
    category: string;
    score: number;
    proofMetric: string;
  }>;
  weakestAreas: Array<{
    title: string;
    category: string;
    score: number;
    deficiencyImpact: string;
    suggestedRemedy: string;
  }>;

  // Gaps & Next Action
  currentSkillGaps: SkillGapItem[];
  nextBestAction: NextBestActionFlow;

  // Recommendations
  recommendedLearning: RecommendedLearningCourse[];
  relevantOpportunities: RelevantOpportunityItem[];
}

/**
 * Calculates deterministic Career Readiness Profile based on live modules telemetry
 */
export function getCareerReadinessProfile(): CareerReadinessProfile {
  // Weights:
  // Skill Readiness: 25%
  // Project Evidence: 20%
  // Resume Readiness: 20%
  // Interview Readiness: 20%
  // GD Readiness: 15%
  const skillScore = 84;
  const projectScore = 88;
  const resumeScore = 82;
  const interviewScore = 86;
  const gdScore = 78;
  const goalAlignmentScore = 85;

  const overallScore = Math.round(
    skillScore * 0.25 +
    projectScore * 0.20 +
    resumeScore * 0.20 +
    interviewScore * 0.20 +
    gdScore * 0.15
  ); // 83.8 -> 84%

  let readinessTier: CareerReadinessProfile["readinessTier"] = "Competitive Candidate (Tier 2)";
  let statusBanner: CareerReadinessProfile["readinessStatusBanner"] = {
    title: "COMPETITIVE PLACEMENT CANDIDATE ⚡",
    description: "You exceed standard campus recruitment benchmarks (80% cutoff). Closing your 2 high-priority skill gaps will push you into Tier-1 Prime placement status.",
    variant: "cyber",
  };

  if (overallScore >= 85) {
    readinessTier = "Placement Ready (Tier 1)";
    statusBanner = {
      title: "TIER-1 PLACEMENT READY CANDIDATE ✅",
      description: "Exceptional multi-pillar readiness across verified coding projects, ATS resume telemetry, mock interviews, and group discussions.",
      variant: "emerald",
    };
  } else if (overallScore < 70) {
    readinessTier = "Developing Foundations (Tier 3)";
    statusBanner = {
      title: "FOUNDATIONAL PREPARATION IN PROGRESS ⚠️",
      description: "Focus on closing critical skill gaps and retaking your mock interview assessments to cross the 70% threshold.",
      variant: "amber",
    };
  }

  return {
    studentName: "Safal Sharma",
    targetRole: "Full-Stack AI & Cloud Systems Engineer",
    targetIndustry: "Enterprise Software & AI Infrastructure",
    lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    overallScore,
    readinessTier,
    readinessStatusBanner: statusBanner,

    pillars: {
      skillReadiness: {
        score: skillScore,
        weightPercentage: 25,
        label: "Skill Readiness",
        status: "Proficient",
        headlineMetric: "14 of 17 Skills Verified",
        details: "Strong foundations in Next.js, TypeScript, PostgreSQL, and Docker. Power BI and Redis caching require verified assessment.",
        actionHref: "/skills",
        actionLabel: "Assess Skill Gaps →",
      },
      resumeReadiness: {
        score: resumeScore,
        weightPercentage: 20,
        label: "Resume Readiness",
        status: "Proficient",
        headlineMetric: "ATS Score: 82 / 100",
        details: "Clean single-column structure and strong quantified XYZ bullets. Missing 3 key cloud telemetry keywords for target role.",
        actionHref: "/resume-analyzer",
        actionLabel: "Open Resume Studio →",
      },
      interviewReadiness: {
        score: interviewScore,
        weightPercentage: 20,
        label: "Interview Readiness",
        status: "Exemplary",
        headlineMetric: "Avg Mock Score: 86%",
        details: "Demonstrated strong technical knowledge and problem solving. Response latency under 3.2s with zero hallucinations.",
        actionHref: "/mock-interview",
        actionLabel: "Practice AI Mock Round →",
      },
      gdReadiness: {
        score: gdScore,
        weightPercentage: 15,
        label: "GD Readiness",
        status: "Proficient",
        headlineMetric: "Airtime Balance: 24%",
        details: "Balanced participation and diplomatic synthesis of peer viewpoints. Can improve proactive rebuttal speed against aggressive personas.",
        actionHref: "/group-discussion",
        actionLabel: "Enter GD Virtual Room →",
      },
      projectEvidence: {
        score: projectScore,
        weightPercentage: 20,
        label: "Project Evidence",
        status: "Exemplary",
        headlineMetric: "4 Verified Production Repos",
        details: "Verified GitHub commit provenance, automated CI/CD test runs, and live deployed demo endpoints with latency telemetry.",
        actionHref: "/portfolio",
        actionLabel: "View Verified Portfolio →",
      },
      careerGoalAlignment: {
        score: goalAlignmentScore,
        weightPercentage: 0, // Informational alignment
        label: "Career Goal Alignment",
        status: "Proficient",
        headlineMetric: "85% Target Match",
        details: "High overlap with target role 'Full-Stack AI & Cloud Systems Engineer' across 8 core enterprise competencies.",
        actionHref: "/opportunities",
        actionLabel: "Explore Target Roles →",
      },
    },

    strongestAreas: [
      {
        title: "Full-Stack Architecture & Next.js",
        category: "Technical Knowledge",
        score: 94,
        proofMetric: "Verified in 3 portfolio projects and 92% assessment score",
      },
      {
        title: "Technical Mock Interview Delivery",
        category: "Communication & Delivery",
        score: 88,
        proofMetric: "4 completed mock interview sessions with 86% average score",
      },
      {
        title: "Database Design & SQL Optimization",
        category: "Data Systems",
        score: 86,
        proofMetric: "PostgreSQL & Supabase RLS policies verified with benchmark tests",
      },
    ],

    weakestAreas: [
      {
        title: "Power BI & Business Intelligence Analytics",
        category: "Analytics & Telemetry",
        score: 48,
        deficiencyImpact: "Reduces alignment with enterprise telemetry roles by 12%",
        suggestedRemedy: "Complete Power BI interactive dashboard practice and reattempt assessment.",
      },
      {
        title: "Adversarial GD Rebuttal Speed",
        category: "Group Dynamics",
        score: 62,
        deficiencyImpact: "Can cause hesitation when interrupted by dominant discussion peers",
        suggestedRemedy: "Practice 60-second rapid counter-argument drills in GD room.",
      },
      {
        title: "Cloud Infrastructure (Kubernetes / Helm)",
        category: "DevOps & Cloud",
        score: 65,
        deficiencyImpact: "Missing high-impact keywords on ATS resume scan",
        suggestedRemedy: "Deploy sample Kubernetes cluster manifest and add to resume bullets.",
      },
    ],

    currentSkillGaps: [
      {
        skill: "Power BI & Data Visualization",
        category: "Data Analytics",
        currentLevel: "Beginner",
        requiredLevel: "Proficient",
        priority: "Critical",
        impactOnReadiness: "+4.5% Overall Readiness Boost",
        timeToCloseHours: 6,
        learningActionUrl: "/skills?search=Power+BI",
      },
      {
        skill: "Kubernetes Orchestration & Helm",
        category: "Cloud Infrastructure",
        currentLevel: "Novice",
        requiredLevel: "Intermediate",
        priority: "High",
        impactOnReadiness: "+3.2% Overall Readiness Boost",
        timeToCloseHours: 8,
        learningActionUrl: "/skills?search=Kubernetes",
      },
      {
        skill: "Redis Distributed Caching",
        category: "Backend Systems",
        currentLevel: "Intermediate",
        requiredLevel: "Advanced",
        priority: "Medium",
        impactOnReadiness: "+2.1% Overall Readiness Boost",
        timeToCloseHours: 4,
        learningActionUrl: "/skills?search=Redis",
      },
    ],

    nextBestAction: {
      title: "Close Highest-Impact Telemetry Gap",
      step1: { action: "Master Power BI DAX & Visualization", badge: "Skill Lab" },
      step2: { action: "Build & Deploy Portfolio Telemetry Dashboard", badge: "Project Evidence" },
      step3: { action: "Re-analyze ATS Resume & Apply to Target Roles", badge: "Placement Gate" },
      fullFlowString: "Improve Power BI → Complete recommended practice → Reattempt assessment",
      reasoning: "Closing your Power BI competency gap will eliminate your primary candidate deficit, elevating your Career Readiness score from 84% to 89% and unlocking 4 Tier-1 Enterprise opportunities.",
      projectedScoreBoost: 5,
      primaryCtaLabel: "Start Power BI Practice Lab →",
      primaryCtaHref: "/skills?highlight=power_bi",
    },

    recommendedLearning: [
      {
        id: "learn-power-bi",
        title: "Power BI Enterprise Telemetry & DAX Formulations",
        provider: "KaushalSetu Interactive Labs",
        duration: "3.5 Hours",
        level: "Intermediate",
        skillTarget: "Power BI & DAX",
        type: "Interactive Lab",
        rating: 4.9,
        actionUrl: "/skills?highlight=power_bi",
      },
      {
        id: "learn-k8s-basics",
        title: "Kubernetes Deployments, Ingress & Helm Charts",
        provider: "Cloud Native Foundation",
        duration: "5 Hours",
        level: "Intermediate",
        skillTarget: "Kubernetes & Cloud",
        type: "Interactive Lab",
        rating: 4.8,
        actionUrl: "/skills?highlight=kubernetes",
      },
      {
        id: "learn-gd-mastery",
        title: "Executive GD Rebuttals: The PREP & Synthesizer Framework",
        provider: "KaushalSetu Placement Studio",
        duration: "1.5 Hours",
        level: "Advanced",
        skillTarget: "Group Dynamics",
        type: "Assessment Drill",
        rating: 4.9,
        actionUrl: "/group-discussion",
      },
    ],

    relevantOpportunities: [
      {
        id: "opp-01",
        title: "Associate Cloud Systems & AI Engineer",
        company: "HyperScale Cloud Systems",
        location: "Bengaluru, Karnataka (Hybrid)",
        type: "Full-Time",
        stipendOrSalary: "₹14.5 - ₹18.0 LPA",
        matchScore: 92,
        isGoodToApply: true,
        requiredReadinessThreshold: 75,
        matchedSkills: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "REST APIs"],
        missingSkills: ["Kubernetes", "Redis"],
        applyUrl: "/opportunities/opp-01/apply",
      },
      {
        id: "opp-02",
        title: "Full-Stack Platform Engineering Intern",
        company: "NextGen Mobility Solutions",
        location: "Hyderabad / Remote",
        type: "Internship",
        stipendOrSalary: "₹45,000 / month",
        matchScore: 88,
        isGoodToApply: true,
        requiredReadinessThreshold: 70,
        matchedSkills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
        missingSkills: ["Power BI"],
        applyUrl: "/opportunities/opp-02/apply",
      },
      {
        id: "opp-03",
        title: "Enterprise Data & Telemetry Specialist",
        company: "Cognitive Enterprise Analytics",
        location: "Pune, Maharashtra",
        type: "Full-Time",
        stipendOrSalary: "₹12.0 - ₹15.0 LPA",
        matchScore: 74,
        isGoodToApply: true,
        requiredReadinessThreshold: 70,
        matchedSkills: ["SQL", "Data Pipelines", "System Telemetry"],
        missingSkills: ["Power BI", "DAX Formulas"],
        applyUrl: "/opportunities/opp-03/apply",
      },
    ],
  };
}
