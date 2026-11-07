import mongoose from 'mongoose';

// User Schema
export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    targetRole: { type: String, default: 'Full Stack Software Engineer' },
    yearsOfExperience: { type: Number, default: 2 },
    preferredLanguage: { type: String, default: 'javascript' },
  },
  stats: {
    interviewsCompleted: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    totalScoreSum: { type: Number, default: 0 },
    totalTokensUsed: { type: Number, default: 0 },
    totalDurationSeconds: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Problem Schema
export const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Expert'], required: true },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  testCases: [{
    id: Number,
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false },
    isEdgeCase: { type: Boolean, default: false },
    description: String
  }],
  hints: [{
    level: Number,
    title: String,
    content: String
  }],
  topics: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Interview Schema
export const interviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  difficulty: { type: String, required: true },
  language: { type: String, enum: ['javascript', 'python', 'java', 'cpp'], required: true },
  tokenBudget: { type: Number, required: true },
  tokensUsed: { type: Number, default: 0 },
  remainingTokens: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  timeElapsedSeconds: { type: Number, default: 0 },
  assistanceMode: {
    type: String,
    enum: ['strict', 'limited_hints', 'standard', 'advanced'],
    default: 'standard'
  },
  interviewMode: {
    type: String,
    enum: ['practice', 'mock_interview', 'strict', 'ai_assisted', 'challenge'],
    default: 'mock_interview'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  codeDraft: { type: String, default: '' },
  notes: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date }
});

// Code Submission Schema
export const codeSubmissionSchema = new mongoose.Schema({
  interviewId: { type: String, required: true },
  userId: { type: String, required: true },
  sourceCode: { type: String, required: true },
  language: { type: String, required: true },
  executionResults: {
    totalTests: Number,
    passedTests: Number,
    failedTests: Number,
    results: [mongoose.Schema.Types.Mixed],
    runtimeMs: Number,
    memoryKb: Number,
    compileStatus: String,
    compileOutput: String
  },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  executionTime: { type: Number, default: 0 },
  memoryUsage: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

// AI Interaction Schema
export const aiInteractionSchema = new mongoose.Schema({
  interviewId: { type: String, required: true },
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ['chat', 'hint', 'debug', 'complexity', 'edge_cases', 'interviewer_question', 'custom'],
    default: 'chat'
  },
  userMessage: { type: String, required: true },
  assistantResponse: { type: String, required: true },
  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  remainingBudget: { type: Number, required: true },
  isSimulated: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// Evaluation Schema
export const evaluationSchema = new mongoose.Schema({
  interviewId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  categoryScores: {
    problemUnderstanding: Number,
    algorithmSelection: Number,
    codeCorrectness: Number,
    timeComplexity: Number,
    spaceComplexity: Number,
    codeQuality: Number,
    edgeCaseHandling: Number,
    independentProblemSolving: Number,
    aiUtilizationEfficiency: Number,
    communicationAndReasoning: Number
  },
  overallScore: { type: Number, required: true },
  approachAnalysis: {
    chosenApproach: String,
    isOptimal: Boolean,
    alternativeApproaches: [String],
    algorithmExplanation: String
  },
  codeQualityAnalysis: {
    readabilityScore: Number,
    modularity: String,
    namingConventions: String,
    maintainability: String
  },
  complexityAnalysis: {
    timeComplexity: String,
    spaceComplexity: String,
    possibleOptimizations: String
  },
  aiUsageAnalysis: {
    totalAiRequests: Number,
    tokensConsumed: Number,
    remainingTokens: Number,
    hintsRequested: Number,
    debuggingRequests: Number,
    aiDependencyScore: Number,
    aiEfficiencyVerdict: String
  },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  verdict: {
    type: String,
    enum: ['Excellent', 'Strong Performance', 'Average', 'Needs Improvement'],
    required: true
  },
  roadmapRecommendations: [{
    topic: String,
    reason: String,
    action: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Custom Problem Schema
export const customProblemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Expert'], default: 'Medium' },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  testCases: [{
    id: Number,
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false },
    description: String
  }],
  topics: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

