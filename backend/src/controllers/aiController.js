import { generateAIResponse } from '../services/aiService.js';
import { Problem, CustomProblem, Interview } from '../models/index.js';

export async function askAI(req, res) {
  try {
    const {
      interviewId,
      message,
      type = 'chat',
      currentCode = '',
      conversationHistory = [],
      hintLevel = 1
    } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: 'interviewId is required.' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized or session not found.' });
    }

    let problem = await Problem.findById(interview.problemId);
    if (!problem) problem = await CustomProblem.findById(interview.problemId);

    if (!problem) {
      return res.status(404).json({ message: 'Problem associated with interview not found.' });
    }

    const result = await generateAIResponse({
      interviewId,
      userId: req.user.userId,
      message,
      type,
      currentCode,
      problem,
      conversationHistory,
      hintLevel: Number(hintLevel) || 1
    });

    res.json(result);
  } catch (err) {
    console.error('[AI Controller] Error:', err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message,
      code: err.code || 'AI_REQUEST_FAILED'
    });
  }
}

