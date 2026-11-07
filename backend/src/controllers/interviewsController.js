import { Interview, Problem, CustomProblem, CodeSubmission, Evaluation, AIInteraction, User } from '../models/index.js';
import { executeCode as runCodeEngine } from '../services/executionService.js';
import { calculateTokenStatus } from '../services/tokenService.js';
import { evaluateSubmission } from '../services/evaluationService.js';

export async function startInterview(req, res) {
  try {
    const {
      problemId,
      language = 'javascript',
      tokenBudget = 2000,
      durationMinutes = 45,
      assistanceMode = 'standard',
      interviewMode = 'mock_interview'
    } = req.body;

    const userId = req.user.userId;

    // Find problem
    let problem = await Problem.findById(problemId);
    if (!problem) {
      problem = await Problem.findOne({ slug: problemId });
    }
    if (!problem) {
      problem = await CustomProblem.findById(problemId);
    }
    if (!problem) {
      return res.status(404).json({ message: 'Selected coding problem not found.' });
    }

    const initialBudget = Math.max(100, Number(tokenBudget) || 2000);
    const starterCode = problem.starterCode?.[language] || '// Write your solution here\n';

    const interview = await Interview.create({
      userId,
      problemId: problem._id || problem.id,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      language,
      tokenBudget: initialBudget,
      tokensUsed: 0,
      remainingTokens: initialBudget,
      durationMinutes: Number(durationMinutes) || 45,
      timeElapsedSeconds: 0,
      assistanceMode,
      interviewMode,
      status: 'in_progress',
      codeDraft: starterCode,
      notes: '',
      startedAt: new Date()
    });

    res.status(201).json({
      message: 'Interview initialized successfully',
      interviewId: interview._id || interview.id,
      interview: {
        id: interview._id || interview.id,
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        language,
        tokenBudget: initialBudget,
        remainingTokens: initialBudget,
        durationMinutes,
        assistanceMode,
        interviewMode,
        startedAt: interview.startedAt
      }
    });
  } catch (err) {
    console.error('[Interview] Start error:', err);
    res.status(500).json({ message: 'Failed to start interview session: ' + err.message });
  }
}

export async function getInterview(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    // Strict user data isolation check
    if (interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this interview session.' });
    }

    // Get problem details
    let problem = await Problem.findById(interview.problemId);
    if (!problem) {
      problem = await CustomProblem.findById(interview.problemId);
    }

    const tokenStatus = calculateTokenStatus(interview.tokenBudget, interview.tokensUsed);

    // Get interactions
    const interactions = await AIInteraction.find({ interviewId: id });

    res.json({
      interview: {
        id: interview._id || interview.id,
        problemId: interview.problemId,
        problemTitle: interview.problemTitle,
        difficulty: interview.difficulty,
        language: interview.language,
        durationMinutes: interview.durationMinutes,
        timeElapsedSeconds: interview.timeElapsedSeconds || 0,
        assistanceMode: interview.assistanceMode,
        interviewMode: interview.interviewMode,
        status: interview.status,
        codeDraft: interview.codeDraft,
        notes: interview.notes || '',
        startedAt: interview.startedAt,
        submittedAt: interview.submittedAt
      },
      tokens: tokenStatus,
      problem: problem ? {
        id: problem._id || problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        topics: problem.topics || [],
        description: problem.description,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints || [],
        examples: problem.examples || [],
        starterCode: problem.starterCode || {},
        testCases: (problem.testCases || []).filter(tc => !tc.isHidden)
      } : null,
      interactions: interactions.map(i => ({
        id: i._id || i.id,
        type: i.type,
        userMessage: i.userMessage,
        assistantResponse: i.assistantResponse,
        totalTokens: i.totalTokens,
        remainingBudget: i.remainingBudget,
        isSimulated: i.isSimulated,
        timestamp: i.timestamp
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve interview session.' });
  }
}

export async function saveDraft(req, res) {
  try {
    const { id } = req.params;
    const { codeDraft, notes, timeElapsedSeconds } = req.body;

    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    const updated = await Interview.findByIdAndUpdate(id, {
      ...(codeDraft !== undefined && { codeDraft }),
      ...(notes !== undefined && { notes }),
      ...(timeElapsedSeconds !== undefined && { timeElapsedSeconds })
    }, { new: true });

    res.json({ message: 'Draft saved', updatedAt: updated.updatedAt });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save draft' });
  }
}

export async function getTokenStatus(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    const tokenStatus = calculateTokenStatus(interview.tokenBudget, interview.tokensUsed);
    const interactions = await AIInteraction.find({ interviewId: id });

    res.json({
      ...tokenStatus,
      history: interactions.map(i => ({
        id: i._id || i.id,
        type: i.type,
        userMessage: i.userMessage,
        inputTokens: i.inputTokens,
        outputTokens: i.outputTokens,
        totalTokens: i.totalTokens,
        remainingBudget: i.remainingBudget,
        timestamp: i.timestamp
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get token details' });
  }
}

export async function runCode(req, res) {
  try {
    const { id } = req.params;
    const { sourceCode, language } = req.body;

    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    let problem = await Problem.findById(interview.problemId);
    if (!problem) problem = await CustomProblem.findById(interview.problemId);

    if (!problem) {
      return res.status(404).json({ message: 'Associated problem not found.' });
    }

    const lang = language || interview.language;
    const code = sourceCode || interview.codeDraft;

    // Run against visible test cases only
    const execution = await runCodeEngine({
      language: lang,
      sourceCode: code,
      problem,
      isSubmission: false
    });

    res.json({ execution });
  } catch (err) {
    console.error('[Interview] Run code error:', err);
    res.status(500).json({ message: 'Code execution failed: ' + err.message });
  }
}

export async function submitInterview(req, res) {
  try {
    const { id } = req.params;
    const { sourceCode, language, timeTakenSeconds } = req.body;

    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    let problem = await Problem.findById(interview.problemId);
    if (!problem) problem = await CustomProblem.findById(interview.problemId);

    const finalCode = sourceCode || interview.codeDraft;
    const finalLanguage = language || interview.language;

    // Run against ALL test cases (visible + hidden + edge cases)
    const execution = await runCodeEngine({
      language: finalLanguage,
      sourceCode: finalCode,
      problem,
      isSubmission: true
    });

    // Create immutable code submission snapshot
    const submission = await CodeSubmission.create({
      interviewId: id,
      userId: req.user.userId,
      sourceCode: finalCode,
      language: finalLanguage,
      executionResults: execution,
      testCasesPassed: execution.passedTests,
      totalTestCases: execution.totalTests,
      executionTime: execution.runtimeMs,
      memoryUsage: execution.memoryKb,
      submittedAt: new Date()
    });

    // Mark interview completed
    await Interview.findByIdAndUpdate(id, {
      status: 'completed',
      submittedAt: new Date(),
      codeDraft: finalCode,
      timeElapsedSeconds: timeTakenSeconds || interview.timeElapsedSeconds || 1200
    });

    // Generate comprehensive evaluation
    const evaluation = await evaluateSubmission({
      interview,
      problem,
      sourceCode: finalCode,
      executionResults: execution,
      timeTakenSeconds: timeTakenSeconds || interview.timeElapsedSeconds || 1200
    });

    // Update candidate stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: {
        'stats.interviewsCompleted': 1,
        'stats.problemsSolved': execution.passedTests === execution.totalTests ? 1 : 0,
        'stats.totalScoreSum': evaluation.overallScore,
        'stats.totalTokensUsed': interview.tokensUsed,
        'stats.totalDurationSeconds': timeTakenSeconds || 1200
      }
    });

    res.json({
      message: 'Interview successfully submitted and evaluated',
      submissionId: submission._id || submission.id,
      evaluationId: evaluation._id || evaluation.id,
      overallScore: evaluation.overallScore,
      verdict: evaluation.verdict,
      execution
    });
  } catch (err) {
    console.error('[Interview] Submit error:', err);
    res.status(500).json({ message: 'Interview submission failed: ' + err.message });
  }
}

export async function getEvaluation(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    const evaluation = await Evaluation.findOne({ interviewId: id });
    const submission = await CodeSubmission.findOne({ interviewId: id });
    let problem = await Problem.findById(interview.problemId);
    if (!problem) problem = await CustomProblem.findById(interview.problemId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation has not been generated for this interview.' });
    }

    res.json({
      evaluation,
      submission,
      interview: {
        id: interview._id || interview.id,
        problemTitle: interview.problemTitle,
        difficulty: interview.difficulty,
        language: interview.language,
        startedAt: interview.startedAt,
        submittedAt: interview.submittedAt,
        tokensUsed: interview.tokensUsed,
        tokenBudget: interview.tokenBudget,
        durationMinutes: interview.durationMinutes
      },
      problem: {
        title: problem?.title,
        difficulty: problem?.difficulty,
        topics: problem?.topics || []
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve assessment results.' });
  }
}

export async function getReplay(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    const submission = await CodeSubmission.findOne({ interviewId: id });
    const interactions = await AIInteraction.find({ interviewId: id });
    const evaluation = await Evaluation.findOne({ interviewId: id });

    res.json({
      interview,
      submission,
      interactions,
      evaluation
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch interview replay.' });
  }
}

export async function deleteInterview(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    await Interview.findByIdAndDelete(id);
    await CodeSubmission.deleteMany({ interviewId: id });
    await AIInteraction.deleteMany({ interviewId: id });
    await Evaluation.deleteMany({ interviewId: id });

    res.json({ message: 'Interview session and associated data deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete interview.' });
  }
}

