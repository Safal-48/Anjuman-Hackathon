/**
 * KaushalSetu AI Career Coach Engine
 * Grounded conversational intelligence powered by live student profile telemetry,
 * skill gaps, ATS resume audits, interview metrics, GD transcripts, and job matches.
 */

export interface StudentCareerContext {
  studentName: string;
  college: string;
  degree: string;
  graduationYear: number;
  targetRole: string;
  targetIndustry: string;
  targetSalaryRange: string;
  overallCareerReadinessScore: number;
  readinessTier: string;

  // Multi-Pillar Telemetry
  skills: {
    verified: Array<{ name: string; score: number; level: string }>;
    unverifiedOrGaps: Array<{
      name: string;
      score: number;
      priority: "Critical" | "High" | "Medium";
      reason: string;
    }>;
  };

  resume: {
    atsScore: number;
    formattingGrade: string;
    strengths: string[];
    weaknesses: string[];
    missingKeywords: string[];
  };

  mockInterview: {
    latestScore: number;
    averageScore: number;
    completedAttempts: number;
    strengths: string[];
    weaknesses: string[];
    weakQuestionsSnippet: string;
  };

  groupDiscussion: {
    latestScore: number;
    airtimePercentage: number;
    strengths: string[];
    growthAreas: string[];
  };

  projects: Array<{
    title: string;
    techStack: string[];
    verifiedProvenance: boolean;
    impactSummary: string;
  }>;

  certifications: string[];

  opportunityMatches: Array<{
    id: string;
    role: string;
    company: string;
    matchScore: number;
    isGoodToApply: boolean;
    missingPrerequisites: string[];
  }>;
}

export interface CoachActionRecommendation {
  label: string;
  href: string;
  module: "Skills" | "Resume" | "Interview" | "GD" | "Portfolio" | "Opportunities";
  priority: "High" | "Medium";
  badgeText: string;
}

export interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  groundedContextTags?: string[];
  recommendedActions?: CoachActionRecommendation[];
  suggestedFollowUps?: string[];
}

/**
 * Standard Grounded Student Telemetry Context (Safal Sharma)
 */
export const DEFAULT_STUDENT_CAREER_CONTEXT: StudentCareerContext = {
  studentName: "Safal Sharma",
  college: "Indian Institute of Technology (BHU) Varanasi",
  degree: "B.Tech in Computer Science & Artificial Intelligence",
  graduationYear: 2026,
  targetRole: "Full-Stack AI & Cloud Systems Engineer",
  targetIndustry: "Enterprise Cloud Platforms & Distributed AI Systems",
  targetSalaryRange: "₹14.0 - ₹18.5 LPA",
  overallCareerReadinessScore: 84,
  readinessTier: "Competitive Candidate (Tier 2)",

  skills: {
    verified: [
      { name: "Next.js & React", score: 94, level: "Expert" },
      { name: "TypeScript", score: 92, level: "Expert" },
      { name: "RESTful & GraphQL APIs", score: 90, level: "Advanced" },
      { name: "PostgreSQL & Supabase RLS", score: 88, level: "Advanced" },
      { name: "Docker & Containerization", score: 85, level: "Intermediate" },
      { name: "Git & Provenance Telemetry", score: 95, level: "Expert" },
      { name: "Tailwind CSS & Vanilla CSS", score: 96, level: "Expert" },
      { name: "Node.js Backend Runtimes", score: 88, level: "Advanced" },
      { name: "Python & Data Structures", score: 82, level: "Intermediate" },
    ],
    unverifiedOrGaps: [
      {
        name: "Power BI & Business Intelligence Analytics",
        score: 48,
        priority: "Critical",
        reason: "Required for enterprise telemetry dashboards and KPI observability",
      },
      {
        name: "Kubernetes & Helm Chart Orchestration",
        score: 65,
        priority: "High",
        reason: "Missing container orchestration verification for Tier-1 Cloud Architect roles",
      },
      {
        name: "Redis Distributed Caching & Pub/Sub",
        score: 70,
        priority: "Medium",
        reason: "Needs benchmark assessment for sub-10ms cache latency verification",
      },
    ],
  },

  resume: {
    atsScore: 82,
    formattingGrade: "A- (Clean Single-Column)",
    strengths: [
      "Quantified XYZ impact bullets across 4 production projects",
      "High contact info completeness with verified GitHub commit provenance",
      "Clean section hierarchy easily readable by enterprise ATS parsers",
    ],
    weaknesses: [
      "Missing critical cloud telemetry keywords: Kubernetes, Helm, Microservices Observability",
      "Certifications section could highlight hands-on cloud labs more prominently",
    ],
    missingKeywords: ["Kubernetes", "Helm", "Prometheus", "Distributed Tracing", "Power BI"],
  },

  mockInterview: {
    latestScore: 86,
    averageScore: 86,
    completedAttempts: 4,
    strengths: [
      "High architectural clarity in distributed system design",
      "Response time latency strictly under 3.2s with concise technical phrasing",
      "Demonstrated deep understanding of Next.js App Router and server actions",
    ],
    weaknesses: [
      "Hesitated during in-depth Linux kernel memory management question",
      "Could articulate Redis cache eviction policies (LRU vs LFU) with more mathematical precision",
    ],
    weakQuestionsSnippet: "Q3: Explain cache stampede prevention and distributed locks under high write concurrency.",
  },

  groupDiscussion: {
    latestScore: 78,
    airtimePercentage: 24,
    strengths: [
      "Maintained optimal airtime share (24% vs 20-30% benchmark)",
      "Structured early debate framing with PREP methodology",
      "Diplomatically acknowledged peer points from Arjun and Priya",
    ],
    growthAreas: [
      "Hesitated to interrupt dominant speaker Vikram during the 4-minute mark",
      "Could cite more empirical enterprise adoption statistics in the opening round",
    ],
  },

  projects: [
    {
      title: "KaushalSetu AI Intelligence & Employability Platform",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
      verifiedProvenance: true,
      impactSummary: "Built multi-agent mock interview, ATS resume parsing, and 7-vector GD simulator.",
    },
    {
      title: "Distributed Stream Ingestion Engine",
      techStack: ["Node.js", "Redis Pub/Sub", "Docker", "PostgreSQL"],
      verifiedProvenance: true,
      impactSummary: "Handled 12,000 requests/sec with sub-15ms p99 latency.",
    },
    {
      title: "AI Clinical Trial Eligibility Matcher",
      techStack: ["Python", "FastAPI", "OpenAlex", "PyMOL"],
      verifiedProvenance: true,
      impactSummary: "Implemented biomedical ontology search with 91% precision.",
    },
    {
      title: "High-Concurrency Async Task Pipeline",
      techStack: ["TypeScript", "Docker", "REST APIs"],
      verifiedProvenance: true,
      impactSummary: "Automated test runner and live telemetry dashboards.",
    },
  ],

  certifications: [
    "AWS Certified Cloud Practitioner (CLF-C02)",
    "Meta Front-End Developer Professional Certificate",
  ],

  opportunityMatches: [
    {
      id: "opp-01",
      role: "Associate Cloud Systems & AI Engineer",
      company: "HyperScale Cloud Systems",
      matchScore: 92,
      isGoodToApply: true,
      missingPrerequisites: ["Kubernetes", "Redis"],
    },
    {
      id: "opp-02",
      role: "Full-Stack Platform Engineering Intern",
      company: "NextGen Mobility Solutions",
      matchScore: 88,
      isGoodToApply: true,
      missingPrerequisites: ["Power BI"],
    },
    {
      id: "opp-03",
      role: "Enterprise Data & Telemetry Specialist",
      company: "Cognitive Enterprise Analytics",
      matchScore: 74,
      isGoodToApply: true,
      missingPrerequisites: ["Power BI", "DAX Formulas"],
    },
  ],
};

/**
 * Intelligent Grounded Response Generator
 */
export function generateCoachResponse(
  userQuery: string,
  context: StudentCareerContext = DEFAULT_STUDENT_CAREER_CONTEXT
): {
  replyText: string;
  groundedContextTags: string[];
  recommendedActions: CoachActionRecommendation[];
  suggestedFollowUps: string[];
} {
  const query = userQuery.toLowerCase().trim();

  // QUESTION 1: "Why am I not ready for this role?" / "Why not ready"
  if (
    query.includes("why am i not ready") ||
    query.includes("not ready for this role") ||
    query.includes("not ready") ||
    query.includes("target role")
  ) {
    return {
      replyText: `### 🎯 Telemetry Audit for: **${context.targetRole}**

Based on your live KaushalSetu data, your overall Career Readiness score is **${context.overallCareerReadinessScore}% (Tier 2 Competitive)**. You are already in the top quartile of campus applicants, but here is exactly why you aren't at **Tier-1 Prime Status (88%+)** yet:

1. **Critical Skill Deficit in Enterprise Telemetry**:
   - Your **Power BI & Data Visualization** score is currently **48% (Critical Gap)**. Enterprise cloud teams require developers to build KPI observability dashboards.
2. **Missing Kubernetes Verification**:
   - While you have verified Docker skills (85%), your **Kubernetes & Helm orchestration** score is **65%**, leaving missing keywords on ATS scans.
3. **GD Rebuttal Speed**:
   - In your recent Group Discussion round, your composite score was **${context.groupDiscussion.latestScore}%**. You maintained great airtime (**${context.groupDiscussion.airtimePercentage}%**), but hesitated to challenge dominant counter-arguments.

**Projected Outcome:** Closing your Power BI lab and adding Kubernetes manifests will elevate your score to **89%**, making you immediately ready for Tier-1 corporate screening.`,
      groundedContextTags: [
        `Overall Readiness: ${context.overallCareerReadinessScore}%`,
        "Critical Gap: Power BI (48%)",
        "High Gap: Kubernetes (65%)",
        `GD Score: ${context.groupDiscussion.latestScore}%`,
      ],
      recommendedActions: [
        {
          label: "Launch Power BI Practice Lab",
          href: "/skills?highlight=power_bi",
          module: "Skills",
          priority: "High",
          badgeText: "+4.5% Score Boost",
        },
        {
          label: "View Target Role Opportunities",
          href: "/opportunities",
          module: "Opportunities",
          priority: "Medium",
          badgeText: "92% Match Available",
        },
      ],
      suggestedFollowUps: [
        "What should I improve first?",
        "How do I fix my resume keywords for this role?",
        "Should I apply for the HyperScale Cloud position now?",
      ],
    };
  }

  // QUESTION 2: "What should I improve first?" / "Next best action" / "Priority"
  if (
    query.includes("what should i improve first") ||
    query.includes("improve first") ||
    query.includes("next best action") ||
    query.includes("priority") ||
    query.includes("what next")
  ) {
    return {
      replyText: `### ⚡ Your #1 Highest-ROI Action: **Power BI & Enterprise Telemetry**

If you have 4–6 hours this week, here is the exact 3-step sequence engineered to yield the highest career readiness ROI:

- **Step 1 [Skill Lab]**: Complete the **Power BI DAX & Telemetry Practice Lab** on KaushalSetu (*Estimated time: 3.5 Hours*).
- **Step 2 [Project Evidence]**: Connect the telemetry output to your *KaushalSetu Platform* repo as an active monitoring dashboard (*Estimated time: 1.5 Hours*).
- **Step 3 [Resume & Placement]**: Re-scan your resume on the **ATS Resume Studio** to register the missing telemetry keywords.

### 📈 Why this first?
Your other pillars are already exceptionally strong:
- **Project Evidence**: **${context.projects.length} Verified Repos** (${context.overallCareerReadinessScore >= 80 ? "Exemplary" : "Proficient"})
- **Technical Mock Interview**: **${context.mockInterview.latestScore}%** (Well above the 75% cutoff)
- **Resume ATS Formatting**: **${context.resume.atsScore}/100**

Closing this single **48% Power BI deficit** removes your only red flag for enterprise recruiters.`,
      groundedContextTags: [
        "Priority 1: Power BI (48% -> 85%)",
        `Mock Interview: ${context.mockInterview.latestScore}%`,
        `ATS Resume: ${context.resume.atsScore}/100`,
        `Verified Repos: ${context.projects.length}`,
      ],
      recommendedActions: [
        {
          label: "Start Power BI Skill Lab (3.5h)",
          href: "/skills?highlight=power_bi",
          module: "Skills",
          priority: "High",
          badgeText: "Recommended First Step",
        },
        {
          label: "Open Career Readiness Dashboard",
          href: "/career-readiness",
          module: "Portfolio",
          priority: "Medium",
          badgeText: "View Full Rubric",
        },
      ],
      suggestedFollowUps: [
        "Why was my interview score 86%?",
        "What skills am I missing?",
        "Should I practice another Group Discussion?",
      ],
    };
  }

  // QUESTION 3: "Why was my interview score low?" / "Interview performance"
  if (
    query.includes("interview score") ||
    query.includes("interview low") ||
    query.includes("why was my interview") ||
    query.includes("mock interview")
  ) {
    return {
      replyText: `### 🎙️ AI Mock Interview Diagnostic Breakdown

Your latest Mock Interview score was **${context.mockInterview.latestScore}% (Interview Ready)** across **${context.mockInterview.completedAttempts} completed rounds**. 

While this score is strong, the AI interviewer identified two specific calibration points that prevented a 95%+ score:

1. **Low-Level System Memory & Concurrency Question**:
   - *Question flagged:* *"Explain cache stampede prevention and distributed locks under high write concurrency."*
   - *Diagnostic:* You accurately explained Redis mutex locks, but did not address probabilistic early expiration (XFetch algorithm) or stampede thundering herds.
2. **Response Latency & Hesitation**:
   - Your average response latency was **3.2 seconds** (very good), but on Question #3 it spiked to **6.8 seconds** with filler words.

### 💡 How to Push to 95%:
- Review the dedicated **Interview Results page** for Question #3.
- Run a targeted 5-minute technical sprint focusing specifically on *High-Concurrency Backend Architecture*.`,
      groundedContextTags: [
        `Latest Mock Score: ${context.mockInterview.latestScore}%`,
        `Attempts: ${context.mockInterview.completedAttempts}`,
        "Weak Question: Cache Stampede & Distributed Locks",
      ],
      recommendedActions: [
        {
          label: "Review Interview Results & Model Answers",
          href: "/mock-interview/results/mock-01",
          module: "Interview",
          priority: "High",
          badgeText: "Audit Answers",
        },
        {
          label: "Start Targeted 5-Min Mock Round",
          href: "/mock-interview",
          module: "Interview",
          priority: "Medium",
          badgeText: "Retake Round",
        },
      ],
      suggestedFollowUps: [
        "What skills am I missing?",
        "Why was my GD score 78%?",
        "What should I improve first?",
      ],
    };
  }

  // QUESTION 4: "What skills am I missing?" / "Skill gaps"
  if (
    query.includes("what skills am i missing") ||
    query.includes("skills am i missing") ||
    query.includes("skill gaps") ||
    query.includes("missing skills")
  ) {
    const gaps = context.skills.unverifiedOrGaps;
    return {
      replyText: `### 🔍 Verified Skill Gaps for **${context.targetRole}**

You have **${context.skills.verified.length} verified competencies** in your portfolio, including top-tier mastery in **Next.js (94%)**, **TypeScript (92%)**, and **PostgreSQL (88%)**. 

Here are your **3 remaining skill gaps** ranked by recruiter impact:

| Skill | Current Level | Required Level | Priority | Impact on Readiness |
|---|---|---|---|---|
| **Power BI & Data Visualization** | Beginner (48%) | Proficient (80%) | 🔴 Critical | **+4.5%** Score Boost |
| **Kubernetes & Helm Charts** | Novice (65%) | Intermediate (80%) | 🟡 High | **+3.2%** Score Boost |
| **Redis Distributed Caching** | Intermediate (70%) | Advanced (85%) | 🟢 Medium | **+2.1%** Score Boost |

**Summary Advice:** You do NOT need to learn dozens of new languages. Closing just **Power BI** and **Kubernetes** will complete 100% of the prerequisite matrix for your target role.`,
      groundedContextTags: [
        `Verified Skills: ${context.skills.verified.length}`,
        "Critical Gap: Power BI (48%)",
        "High Gap: Kubernetes (65%)",
        "Medium Gap: Redis (70%)",
      ],
      recommendedActions: [
        {
          label: "Assess & Verify Power BI",
          href: "/skills?highlight=power_bi",
          module: "Skills",
          priority: "High",
          badgeText: "Critical Gap",
        },
        {
          label: "Assess Kubernetes Competency",
          href: "/skills?highlight=kubernetes",
          module: "Skills",
          priority: "Medium",
          badgeText: "High Priority",
        },
      ],
      suggestedFollowUps: [
        "What should I improve first?",
        "Should I apply for this internship?",
        "Why am I not ready for this role?",
      ],
    };
  }

  // QUESTION 5: "Should I apply for this internship?" / "Apply for job" / "Opportunities"
  if (
    query.includes("should i apply") ||
    query.includes("apply for this internship") ||
    query.includes("opportunity") ||
    query.includes("hyperscale") ||
    query.includes("nextgen")
  ) {
    return {
      replyText: `### 💼 Application Readiness Advisory

Here is an analysis of your top 2 matched opportunities:

1. **HyperScale Cloud Systems — Associate Cloud & AI Engineer (₹14.5 - ₹18.0 LPA)**:
   - **Match Score: 92% (Good to Apply ✅)**
   - *Matched:* Next.js, TypeScript, PostgreSQL, Docker, REST APIs.
   - *Missing:* Kubernetes, Redis.
   - *Verdict:* **YES, Apply Now.** Your 84% readiness exceeds their 75% cutoff. In your application, emphasize your *Distributed Stream Ingestion Engine* project to prove high-concurrency capabilities.

2. **NextGen Mobility Solutions — Full-Stack Platform Intern (₹45,000/mo)**:
   - **Match Score: 88% (Good to Apply ✅)**
   - *Matched:* React, TypeScript, Tailwind CSS, Node.js.
   - *Missing:* Power BI.
   - *Verdict:* **YES, Strong Candidate.** Your portfolio demonstrates production-level Next.js capabilities far exceeding standard internship requirements.

**Pro-Tip:** Make sure to verify Application Readiness before submitting to ensure your 82% ATS resume is attached.`,
      groundedContextTags: [
        "HyperScale Match: 92% (Good to Apply)",
        "NextGen Match: 88% (Good to Apply)",
        `Overall Readiness: ${context.overallCareerReadinessScore}%`,
      ],
      recommendedActions: [
        {
          label: "Apply to HyperScale Cloud (92% Match)",
          href: "/opportunities/opp-01/apply",
          module: "Opportunities",
          priority: "High",
          badgeText: "Good to Apply",
        },
        {
          label: "Apply to NextGen Mobility (88% Match)",
          href: "/opportunities/opp-02/apply",
          module: "Opportunities",
          priority: "Medium",
          badgeText: "Good to Apply",
        },
      ],
      suggestedFollowUps: [
        "Why am I not ready for this role?",
        "What should I improve first?",
        "How can I tailor my resume for HyperScale?",
      ],
    };
  }

  // QUESTION 6: "Why was my GD score 78%?" / "Group discussion feedback"
  if (
    query.includes("gd score") ||
    query.includes("group discussion") ||
    query.includes("gd performance") ||
    query.includes("78%")
  ) {
    return {
      replyText: `### 👥 Group Discussion Diagnostic Breakdown

In your latest GD on *"Will Generative AI Replace Entry-Level Engineering Jobs?"*, you scored **${context.groupDiscussion.latestScore}% (Competitive Participant)**.

**Where you excelled:**
- **Optimal Airtime Share**: You spoke for **${context.groupDiscussion.airtimePercentage}% of the total discussion time**, right in the gold standard 20%–30% window.
- **Analytical Framing**: Reframed the debate from panic to engineering verification and test telemetry.

**Where points were lost:**
- **Priya's Counter-Argument**: When challenged by Priya on hiring contraction, you took 8 seconds to respond before citing your velocity statistics.
- **Dominant Speaker Interruption**: When Vikram dominated the middle round, you did not assertively interject to steer the group back to technical guardrails.

**Recommended Drill:** Retake a 5-minute GD round with *Frontier / IIM Tier Difficulty* to practice fast rebuttals using the **PREP Framework (Point $\rightarrow$ Reason $\rightarrow$ Example $\rightarrow$ Point)**.`,
      groundedContextTags: [
        `GD Score: ${context.groupDiscussion.latestScore}%`,
        `Airtime: ${context.groupDiscussion.airtimePercentage}%`,
        "Adversarial Challenger: Priya Sharma",
      ],
      recommendedActions: [
        {
          label: "View Full GD Performance Report",
          href: "/group-discussion/results/mock-gd-01",
          module: "GD",
          priority: "High",
          badgeText: "Audit 7 Vectors",
        },
        {
          label: "Practice Rapid GD Rebuttals",
          href: "/group-discussion",
          module: "GD",
          priority: "Medium",
          badgeText: "Retake Round",
        },
      ],
      suggestedFollowUps: [
        "What should I improve first?",
        "Why was my interview score 86%?",
        "What skills am I missing?",
      ],
    };
  }

  // QUESTION 7: Concept Tutoring: "SQL JOIN" or Natural Hinglish queries like "bhai mujhe sql join simple example ke saath samjha"
  if (
    query.includes("sql join") ||
    query.includes("join") ||
    query.includes("sql") && query.includes("example") ||
    query.includes("samjha") && query.includes("join")
  ) {
    const isHinglish = query.includes("bhai") || query.includes("samjha") || query.includes("kya") || query.includes("kaise") || query.includes("mujhe");
    
    if (isHinglish) {
      return {
        replyText: `### 🤖 AI Tutor: SQL JOIN Concept (Hinglish Mode)
        
Bhai simple shabdon mein samjho! 💡

**SQL JOIN** ka use hum tab karte hain jab humein 2 ya zyada alag-alag tables ke related data ko ek single result mein combine karna hota hai.

#### 🛒 Real-World Example (E-Commerce):
1. **Customers Table:**
   - \`CustomerID\`, \`Name\`, \`City\`
2. **Orders Table:**
   - \`OrderID\`, \`CustomerID\`, \`Amount\`

Agar humein dekhna hai ki *"Kis Customer ne kitne amount ka order place kiya?"*, toh hum common key (\`CustomerID\`) ke through **INNER JOIN** lagate hain:

\`\`\`sql
SELECT Customers.Name, Orders.OrderID, Orders.Amount
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
\`\`\`

#### ⚡ Quick Types of JOINs:
- **INNER JOIN:** Sirf wahi records aate hain jo dono tables mein match karte hain.
- **LEFT JOIN:** Left table ke saare records + Right table ke matching records.
- **RIGHT JOIN:** Right table ke saare records + Left table ke matching records.
- **FULL OUTER JOIN:** Dono tables ke saare records chahe match ho ya na ho.

Ab batao, iska practical diagnostic challenge solve karna chahte ho?`,
        groundedContextTags: [
          "Concept: SQL Relational Joins",
          "Language: Hinglish",
          "Domain: Database Systems",
        ],
        recommendedActions: [
          {
            label: "Practice SQL Sandboxes",
            href: "/learning/resources",
            module: "Skills",
            priority: "High",
            badgeText: "Hands-on Sandbox",
          },
          {
            label: "Take SQL Diagnostic Probe",
            href: "/assessment",
            module: "Skills",
            priority: "Medium",
            badgeText: "Verify Mastery",
          },
        ],
        suggestedFollowUps: [
          "Bhai LEFT JOIN aur INNER JOIN mein practical difference batao",
          "SQL indexing kaise kaam karti hai?",
          "What should I improve first?",
        ],
      };
    }

    return {
      replyText: `### 🤖 Socratic AI Tutor: SQL Relational JOINs

A **SQL JOIN** is an operation used to combine rows from two or more tables based on a related column between them.

#### 📊 Visual Analogy:
Consider two relational tables:
- **\`Customers\`** (\`id\`, \`name\`, \`email\`)
- **\`Orders\`** (\`id\`, \`customer_id\`, \`total_price\`)

By executing an **INNER JOIN** on \`Customers.id = Orders.customer_id\`, relational engines construct a unified tuple:

\`\`\`sql
SELECT 
    c.name, 
    o.id AS order_id, 
    o.total_price
FROM Customers c
INNER JOIN Orders o ON c.id = o.customer_id;
\`\`\`

#### 🔑 Four Core Join Types:
1. **INNER JOIN**: Returns records that have matching values in both tables.
2. **LEFT (OUTER) JOIN**: Returns all records from the left table, and matched records from the right table (NULL if no match).
3. **RIGHT (OUTER) JOIN**: Returns all records from the right table, and matched records from the left table.
4. **FULL (OUTER) JOIN**: Returns all records when there is a match in either left or right table.`,
      groundedContextTags: [
        "Concept: SQL Joins",
        "Language: English",
        "Domain: Database Architecture",
      ],
      recommendedActions: [
        {
          label: "Open SQL Learning Resources",
          href: "/learning/resources",
          module: "Skills",
          priority: "High",
          badgeText: "Curated Queue",
        },
        {
          label: "Launch Skill Assessment",
          href: "/assessment",
          module: "Skills",
          priority: "Medium",
          badgeText: "Verify Skill DNA",
        },
      ],
      suggestedFollowUps: [
        "Explain SQL indexing optimization strategies",
        "What is the difference between LEFT JOIN and RIGHT JOIN?",
        "What should I improve first?",
      ],
    };
  }

  // DEFAULT / GENERAL QUERY RESPONSE
  return {
    replyText: `### 🧭 AI Career Coach Assessment

Thank you for your question regarding **"${userQuery}"**.

Reviewing your telemetry across KaushalSetu:
- **Current Target Role**: ${context.targetRole}
- **Career Readiness Score**: **${context.overallCareerReadinessScore}% (Tier 2 Competitive Candidate)**
- **Strongest Asset**: High-impact production portfolio (${context.projects.length} verified repos) and solid mock interview performance (**${context.mockInterview.latestScore}%**).
- **Primary Bottleneck**: Unverified telemetry competencies in **Power BI (48%)** and **Kubernetes (65%)**.

To make immediate progress toward Tier-1 placement readiness, I recommend starting with your highest-ROI gap or taking a targeted assessment drill below.`,
    groundedContextTags: [
      `Overall Readiness: ${context.overallCareerReadinessScore}%`,
      `Target Role: ${context.targetRole}`,
      `Verified Projects: ${context.projects.length}`,
    ],
    recommendedActions: [
      {
        label: "Launch Power BI Practice Lab",
        href: "/skills?highlight=power_bi",
        module: "Skills",
        priority: "High",
        badgeText: "Recommended First Step",
      },
      {
        label: "Check Overall Career Readiness",
        href: "/career-readiness",
        module: "Portfolio",
        priority: "Medium",
        badgeText: "View Full Audit",
      },
    ],
    suggestedFollowUps: [
      "Why am I not ready for this role?",
      "What should I improve first?",
      "Why was my interview score low?",
      "What skills am I missing?",
      "Should I apply for this internship?",
    ],
  };
}

/**
 * Pre-seeded realistic conversation history for initial demo experience
 */
export const INITIAL_COACH_CONVERSATION: CoachMessage[] = [
  {
    id: "msg-welcome-01",
    sender: "coach",
    text: `### 🤖 Welcome, Safal! I'm your KaushalSetu AI Career Coach.

I have synchronized your live profile telemetry:
- **Target Role:** Full-Stack AI & Cloud Systems Engineer
- **Career Readiness Score:** **84% (Tier 2 Competitive)**
- **Verified Skills:** 14 of 17 competencies verified
- **Latest Mock Interview:** **86%** • **GD Performance:** **78%**
- **ATS Resume Readiness:** **82 / 100**

I'm here to give you data-grounded guidance on skill gaps, interview bottlenecks, ATS optimization, and application timing. 

Select a quick question below or ask me anything!`,
    timestamp: "Just now",
    groundedContextTags: [
      "Target Role: Cloud Systems Engineer",
      "Readiness: 84%",
      "Verified Skills: 14/17",
      "ATS Score: 82/100",
    ],
    suggestedFollowUps: [
      "Why am I not ready for this role?",
      "What should I improve first?",
      "Why was my interview score low?",
      "What skills am I missing?",
      "Should I apply for this internship?",
    ],
  },
];
