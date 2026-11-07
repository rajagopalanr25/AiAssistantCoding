import { Problem, CustomProblem } from '../models/index.js';

export async function getProblems(req, res) {
  try {
    const { difficulty, topic, search } = req.query;
    
    // Fetch standard problems and user custom problems if authenticated
    let problems = await Problem.find({});
    
    if (req.user?.userId) {
      const custom = await CustomProblem.find({ userId: req.user.userId });
      problems = [...problems, ...custom];
    }

    // Filter
    if (difficulty && difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
    }

    if (topic && topic !== 'All') {
      problems = problems.filter(p => p.topics?.some(t => t.toLowerCase() === topic.toLowerCase()));
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      problems = problems.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.topics?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Return sanitized problem summaries (without exposing hidden test cases)
    const sanitized = problems.map(p => ({
      id: p._id || p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics || [],
      descriptionSnippet: p.description?.slice(0, 140) + '...',
      testCaseCount: p.testCases?.length || 0,
      createdAt: p.createdAt
    }));

    res.json({ problems: sanitized });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch problems: ' + err.message });
  }
}

export async function getProblemBySlugOrId(req, res) {
  try {
    const { idOrSlug } = req.params;
    let problem = await Problem.findOne({ slug: idOrSlug });
    if (!problem) {
      problem = await Problem.findById(idOrSlug);
    }
    if (!problem && req.user?.userId) {
      problem = await CustomProblem.findOne({ slug: idOrSlug, userId: req.user.userId });
    }

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Filter out hidden test cases for regular inspection
    const sanitized = {
      ...problem,
      id: problem._id || problem.id,
      testCases: (problem.testCases || []).filter(tc => !tc.isHidden).map(tc => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.description,
        isEdgeCase: tc.isEdgeCase,
        isHidden: false
      }))
    };

    res.json({ problem: sanitized });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch problem details' });
  }
}

export async function createCustomProblem(req, res) {
  try {
    const { title, difficulty, description, inputFormat, outputFormat, constraints, starterCode, testCases, topics } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const custom = await CustomProblem.create({
      userId: req.user.userId,
      title,
      slug: `${slug}-${Date.now().toString(36)}`,
      difficulty: difficulty || 'Medium',
      description,
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      constraints: Array.isArray(constraints) ? constraints : [constraints].filter(Boolean),
      starterCode: starterCode || {
        javascript: `function solution(input) {\n  // Custom solution\n}`,
        python: `def solution(input):\n    pass`,
        java: `class Solution {\n    public void solution() {}\n}`,
        cpp: `class Solution {\npublic:\n    void solution() {}\n};`
      },
      testCases: Array.isArray(testCases) ? testCases : [],
      topics: Array.isArray(topics) ? topics : ['Custom']
    });

    res.status(201).json({ message: 'Custom problem created successfully', problem: custom });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create custom problem: ' + err.message });
  }
}

