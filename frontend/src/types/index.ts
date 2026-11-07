export type Language = 'javascript' | 'python' | 'java' | 'cpp';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type AssistanceMode = 'strict' | 'limited_hints' | 'standard' | 'advanced';
export type InterviewMode = 'practice' | 'mock_interview' | 'strict' | 'ai_assisted' | 'challenge';

export interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    bio?: string;
    targetRole?: string;
    yearsOfExperience?: number;
    avatar?: string;
    preferredLanguage?: Language;
  };
  stats?: {
    interviewsCompleted: number;
    problemsSolved: number;
    totalScoreSum: number;
    totalTokensUsed: number;
    totalDurationSeconds: number;
  };
}

export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  descriptionSnippet: string;
  testCaseCount: number;
  createdAt?: string;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  isEdgeCase?: boolean;
  description?: string;
}

export interface ProblemDetail {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topics: string[];
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode?: Record<Language, string>;
  testCases?: TestCase[];
}

export interface TokenStatus {
  tokenBudget: number;
  tokensUsed: number;
  remainingTokens: number;
  usagePercentage: number;
  warningLevel: 'normal' | 'warning' | 'critical' | 'exhausted';
  isExhausted: boolean;
}

export interface AIInteractionItem {
  id: string;
  type: 'chat' | 'hint' | 'debug' | 'complexity' | 'edge_cases' | 'interviewer_question' | 'custom';
  userMessage: string;
  assistantResponse: string;
  totalTokens: number;
  remainingBudget: number;
  isSimulated?: boolean;
  timestamp: string;
}

export interface ExecutionTestCaseResult {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  executionTimeMs: number;
  isHidden?: boolean;
  isEdgeCase?: boolean;
  description?: string;
  error?: string | null;
}

export interface ExecutionResult {
  success: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: ExecutionTestCaseResult[];
  runtimeMs: number;
  memoryKb: number;
  compileStatus: 'OK' | 'ERROR';
  compileOutput: string;
}

export interface InterviewSession {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: Language;
  durationMinutes: number;
  timeElapsedSeconds: number;
  assistanceMode: AssistanceMode;
  interviewMode: InterviewMode;
  status: 'in_progress' | 'completed' | 'abandoned';
  codeDraft: string;
  notes: string;
  startedAt: string;
  submittedAt?: string;
}

export interface EvaluationResult {
  id: string;
  interviewId: string;
  overallScore: number;
  categoryScores: {
    problemUnderstanding: number;
    algorithmSelection: number;
    codeCorrectness: number;
    timeComplexity: number;
    spaceComplexity: number;
    codeQuality: number;
    edgeCaseHandling: number;
    independentProblemSolving: number;
    aiUtilizationEfficiency: number;
    communicationAndReasoning: number;
  };
  approachAnalysis: {
    chosenApproach: string;
    isOptimal: boolean;
    alternativeApproaches: string[];
    algorithmExplanation: string;
  };
  codeQualityAnalysis: {
    readabilityScore: number;
    modularity: string;
    namingConventions: string;
    maintainability: string;
  };
  complexityAnalysis: {
    timeComplexity: string;
    spaceComplexity: string;
    possibleOptimizations: string;
  };
  aiUsageAnalysis: {
    totalAiRequests: number;
    tokensConsumed: number;
    remainingTokens: number;
    hintsRequested: number;
    debuggingRequests: number;
    aiDependencyScore: number;
    aiEfficiencyVerdict: string;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  verdict: 'Excellent' | 'Strong Performance' | 'Average' | 'Needs Improvement';
  roadmapRecommendations: Array<{
    topic: string;
    reason: string;
    action: string;
  }>;
  createdAt: string;
}

