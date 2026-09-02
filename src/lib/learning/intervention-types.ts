export type InterventionStage =
  | "concept"
  | "example"
  | "guided_question"
  | "student_answer"
  | "ai_feedback"
  | "adaptive_practice"
  | "mini_assessment"
  | "completed";

export interface GuidedQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GuidedQuestion {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questionText: string;
  codeSnippet?: string;
  options: GuidedQuestionOption[];
  hint: string;
  simplifiedFallbackExample?: {
    analogyText: string;
    simplifiedQuestionText: string;
    simplifiedOptions: GuidedQuestionOption[];
  };
  harderFollowUpQuestion?: {
    questionText: string;
    codeSnippet?: string;
    options: GuidedQuestionOption[];
  };
}

export interface TargetedIntervention {
  id: string;
  topic: string;
  skillDomain: string;
  estimatedDuration: string; // "15 minutes"
  targetDeficit: string; // e.g. "42% -> 75% Benchmark"
  
  // Step 1: Concept Explanation
  conceptExplanation: {
    title: string;
    summary: string;
    coreRules: string[];
    syntaxSnippet?: string;
  };

  // Step 2: Simple Real-world Example
  realWorldExample: {
    domain: string;
    scenario: string;
    tableA: { name: string; schema: string[]; sampleRows: string[][] };
    tableB: { name: string; schema: string[]; sampleRows: string[][] };
    expectedOutputExplanation: string;
    codeSnippet: string;
  };

  // Step 3-6: Guided Question & Adaptive Branching
  guidedQuestion: GuidedQuestion;

  // Step 7: Mini Assessment Probes
  miniAssessment: {
    title: string;
    passScorePercentage: number;
    questions: Array<{
      id: string;
      questionText: string;
      options: GuidedQuestionOption[];
    }>;
  };
}
