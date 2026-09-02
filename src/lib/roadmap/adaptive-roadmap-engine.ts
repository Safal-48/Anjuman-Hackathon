import { AdaptiveRoadmapNode, AdaptiveTrackRoadmap } from "./adaptive-roadmap-types";

export const DEFAULT_DATA_ANALYST_ROADMAP: AdaptiveTrackRoadmap = {
  trackId: "data_analyst_track",
  trackTitle: "Data Analyst & Business Intelligence Track",
  targetRole: "Data Analyst & Business Intelligence Engineer",
  targetReadinessScore: 85,
  currentTrackProgress: 38,
  nodes: [
    {
      id: "node-1",
      title: "Excel Fundamentals",
      category: "Spreadsheet Modeling",
      order: 1,
      status: "completed",
      statusBadge: "✅ Completed",
      currentProficiency: 92,
      targetProficiency: 75,
      relevance: "HIGH",
      dependencyPrerequisites: [],
      pipelineFlow: {
        learningResource: {
          title: "VLOOKUP, XLOOKUP & Pivot Table Mastery",
          type: "Interactive Sandbox",
          duration: "30 mins",
          url: "/learning/resources?highlight=Excel",
        },
        explanation: {
          keyConcepts: ["Pivot Tables", "Nested Formulas", "Data Hygiene"],
          socraticSummary: "Mastered structured cell addressing and aggregation metrics.",
        },
        practice: {
          sandboxTitle: "E-Commerce Revenue Pivot Audit",
          challengeCount: 4,
          estimatedMinutes: 20,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "Spreadsheet Analytics Probe",
          questionCount: 5,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 80,
          postScore: 92,
          verifiedDelta: "+12%",
          isProven: true,
          provenTimestamp: "Last Week",
        },
      },
    },
    {
      id: "node-2",
      title: "SQL Basics",
      category: "Data Systems",
      order: 2,
      status: "proven",
      statusBadge: "🟢 Skill Proven",
      currentProficiency: 86,
      targetProficiency: 75,
      relevance: "HIGH",
      dependencyPrerequisites: ["Excel Fundamentals"],
      pipelineFlow: {
        learningResource: {
          title: "SQL SELECT, WHERE Filtering & Arithmetic Expressions",
          type: "Interactive Sandbox",
          duration: "25 mins",
          url: "/learning/resources?highlight=SQL",
        },
        explanation: {
          keyConcepts: ["SELECT DISTINCT", "WHERE IN / BETWEEN", "Logical Operator Precedence"],
          socraticSummary: "Deterministic predicate query construction and deduplication mastered.",
        },
        practice: {
          sandboxTitle: "Customer Filter Drill",
          challengeCount: 3,
          estimatedMinutes: 15,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "SQL Foundational Probe",
          questionCount: 4,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 70,
          postScore: 86,
          verifiedDelta: "+16%",
          isProven: true,
          provenTimestamp: "Yesterday, 06:15 PM",
        },
      },
    },
    {
      id: "node-3",
      title: "SQL JOINs",
      category: "Data Systems",
      order: 3,
      status: "current_priority",
      statusBadge: "🔴 CURRENT PRIORITY",
      currentProficiency: 42,
      targetProficiency: 75,
      relevance: "HIGH",
      dependencyPrerequisites: ["SQL Basics"],
      pipelineFlow: {
        learningResource: {
          title: "Relational Multi-Table Venn Overlaps & NULL Handlers",
          type: "Interactive Sandbox",
          duration: "25 mins",
          url: "/learning/resources?highlight=JOINs",
        },
        explanation: {
          keyConcepts: ["INNER vs LEFT vs FULL JOIN", "Foreign Key Relationships", "NULL Value Preservation with COALESCE"],
          socraticSummary: "Critical prerequisite for constructing relational multi-table datasets.",
          hinglishAnalogy: "Zomato Customers table aur Orders table ko customer_id ke through jodne ka concept.",
        },
        practice: {
          sandboxTitle: "Multi-Table E-Commerce Order Aggregates",
          challengeCount: 4,
          estimatedMinutes: 20,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "Targeted SQL JOINs Reassessment Probe",
          questionCount: 5,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 42,
          isProven: false,
        },
      },
    },
    {
      id: "node-4",
      title: "Advanced SQL & Subqueries",
      category: "Data Systems",
      order: 4,
      status: "upcoming",
      statusBadge: "⚪ Upcoming",
      currentProficiency: 32,
      targetProficiency: 75,
      relevance: "HIGH",
      dependencyPrerequisites: ["SQL JOINs"],
      pipelineFlow: {
        learningResource: {
          title: "Window Functions, RANK, DENSE_RANK & CTEs",
          type: "System Walkthrough",
          duration: "35 mins",
          url: "/learning/resources?highlight=SQL",
        },
        explanation: {
          keyConcepts: ["OVER (PARTITION BY)", "Correlated Subquery Optimization", "Common Table Expressions"],
          socraticSummary: "Analytical partitioning and ranking without GROUP BY row collapsing.",
        },
        practice: {
          sandboxTitle: "Department Salary Ranking Challenge",
          challengeCount: 3,
          estimatedMinutes: 25,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "Advanced SQL Probe",
          questionCount: 4,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 32,
          isProven: false,
        },
      },
    },
    {
      id: "node-5",
      title: "Descriptive Statistics",
      category: "Analytical Math",
      order: 5,
      status: "upcoming",
      statusBadge: "⚪ Upcoming",
      currentProficiency: 58,
      targetProficiency: 75,
      relevance: "MEDIUM",
      dependencyPrerequisites: ["Excel Fundamentals"],
      pipelineFlow: {
        learningResource: {
          title: "Mean, Median, Standard Deviation & Outlier Detection",
          type: "Video Breakdown",
          duration: "30 mins",
          url: "/learning/resources?highlight=Statistics",
        },
        explanation: {
          keyConcepts: ["Variance", "Z-Score Normalization", "Interquartile Range"],
          socraticSummary: "Statistical grounding to prevent misinterpreting anomalous data distributions.",
        },
        practice: {
          sandboxTitle: "Outlier Cleansing Sandbox",
          challengeCount: 3,
          estimatedMinutes: 15,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "Applied Statistics Probe",
          questionCount: 5,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 58,
          isProven: false,
        },
      },
    },
    {
      id: "node-6",
      title: "Power BI & DAX Dashboards",
      category: "Business Intelligence",
      order: 6,
      status: "upcoming",
      statusBadge: "⚪ Upcoming",
      currentProficiency: 34,
      targetProficiency: 75,
      relevance: "HIGH",
      dependencyPrerequisites: ["SQL JOINs", "Descriptive Statistics"],
      pipelineFlow: {
        learningResource: {
          title: "DAX Measures, CALCULATE Engine & KPI Visuals",
          type: "Video Breakdown",
          duration: "40 mins",
          url: "/learning/resources?highlight=Power%20BI",
        },
        explanation: {
          keyConcepts: ["Row Context vs Filter Context", "Star Schema Relations", "Time Intelligence"],
          socraticSummary: "Build enterprise-grade interactive dashboards for executive observability.",
        },
        practice: {
          sandboxTitle: "Sales Executive Dashboard Build",
          challengeCount: 2,
          estimatedMinutes: 30,
          practiceUrl: "/practice",
        },
        assessment: {
          probeTitle: "Power BI DAX Probe",
          questionCount: 5,
          passThresholdPercentage: 75,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 34,
          isProven: false,
        },
      },
    },
    {
      id: "node-7",
      title: "Real-World Capstone Project",
      category: "Applied Portfolio",
      order: 7,
      status: "upcoming",
      statusBadge: "⚪ Upcoming",
      currentProficiency: 0,
      targetProficiency: 85,
      relevance: "HIGH",
      dependencyPrerequisites: ["Power BI & DAX Dashboards", "Advanced SQL & Subqueries"],
      pipelineFlow: {
        learningResource: {
          title: "End-to-End SaaS Telemetry & Cohort Retention Analytics",
          type: "Code Lab",
          duration: "90 mins",
          url: "/learning/resources",
        },
        explanation: {
          keyConcepts: ["Full ETL Pipeline", "Production Data Warehousing", "Automated KPI Reporting"],
          socraticSummary: "Complete production-ready artifact for recruiter portfolio evaluation.",
        },
        practice: {
          sandboxTitle: "Deploy Live Telemetry Dashboard",
          challengeCount: 1,
          estimatedMinutes: 60,
          practiceUrl: "/portfolio",
        },
        assessment: {
          probeTitle: "Portfolio Code Review & Oral Defense",
          questionCount: 3,
          passThresholdPercentage: 80,
          quizUrl: "/assessment",
        },
        result: {
          preScore: 0,
          isProven: false,
        },
      },
    },
  ],
};

/**
 * Automatically simulates/executes the adaptive roadmap transformation when a skill improves
 */
export function simulateAdaptiveSkillProof(
  currentRoadmap: AdaptiveTrackRoadmap,
  targetNodeId: string = "node-3",
  newScore: number = 84
): AdaptiveTrackRoadmap {
  const updatedNodes = currentRoadmap.nodes.map((node) => {
    if (node.id === targetNodeId) {
      return {
        ...node,
        status: "proven" as const,
        statusBadge: "🟢 Skill Proven" as const,
        currentProficiency: newScore,
        pipelineFlow: {
          ...node.pipelineFlow,
          result: {
            preScore: node.currentProficiency,
            postScore: newScore,
            verifiedDelta: `+${newScore - node.currentProficiency}% Gain`,
            isProven: true,
            provenTimestamp: "Just now (Verified Reassessment)",
          },
        },
      };
    }

    // Automatically shift the next node to CURRENT PRIORITY
    if (node.id === "node-4" && targetNodeId === "node-3") {
      return {
        ...node,
        status: "current_priority" as const,
        statusBadge: "🔴 CURRENT PRIORITY" as const,
      };
    }

    return node;
  });

  return {
    ...currentRoadmap,
    currentTrackProgress: 52,
    nodes: updatedNodes,
  };
}
