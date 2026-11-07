import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETest() {
  console.log('🧪 Starting CodeArena AI End-to-End Workflow Verification...');

  // 1. Health check
  const health = await axios.get(`${BASE_URL}/health`);
  console.log('✅ 1. Health check passed:', health.data.service);

  // 2. Login as Demo User
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'demo@codearena.ai',
    password: 'password123'
  });
  const token = loginRes.data.token;
  const user = loginRes.data.user;
  console.log(`✅ 2. Logged in as: ${user.name} (${user.email})`);

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 3. Fetch problems
  const problemsRes = await axios.get(`${BASE_URL}/problems`, authHeaders);
  const problems = problemsRes.data.problems;
  console.log(`✅ 3. Fetched ${problems.length} problems. First: "${problems[0].title}" (${problems[0].difficulty})`);

  const twoSumProb = problems.find(p => p.slug === 'two-sum') || problems[0];

  // 4. Start Interview Session
  const startRes = await axios.post(`${BASE_URL}/interviews/start`, {
    problemId: twoSumProb.id,
    language: 'javascript',
    tokenBudget: 2000,
    durationMinutes: 45,
    assistanceMode: 'standard',
    interviewMode: 'mock_interview'
  }, authHeaders);

  const interviewId = startRes.data.interviewId;
  console.log(`✅ 4. Interview session launched! ID: ${interviewId}, Token Budget: ${startRes.data.interview.tokenBudget}`);

  // 5. Query AI Assistant (Hint & Complexity)
  console.log('🤖 5. Testing AI Assistant mentorship and token accounting...');
  const aiRes1 = await axios.post(`${BASE_URL}/ai/query`, {
    interviewId,
    message: 'Can you give me a conceptual hint for solving Two Sum?',
    type: 'hint',
    currentCode: 'function twoSum(nums, target) {}',
    hintLevel: 1
  }, authHeaders);

  console.log(`   AI Response: ${aiRes1.data.response.slice(0, 80)}...`);
  console.log(`   Tokens Deducted: ${aiRes1.data.tokens.totalThisRequest}, Remaining: ${aiRes1.data.tokens.remainingTokens}/${aiRes1.data.tokens.budget} (${aiRes1.data.tokens.usagePercentage}% used)`);

  if (aiRes1.data.tokens.remainingTokens >= 2000) {
    throw new Error('Token deduction failed');
  }

  // 6. Test Sandboxed Code Execution
  console.log('⚡ 6. Testing code execution runner against sample test cases...');
  const workingSolution = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;

  const runRes = await axios.post(`${BASE_URL}/interviews/${interviewId}/execute`, {
    sourceCode: workingSolution,
    language: 'javascript'
  }, authHeaders);

  const exec = runRes.data.execution;
  console.log(`   Execution Results: ${exec.passedTests}/${exec.totalTests} tests passed, Runtime: ${exec.runtimeMs}ms, Memory: ${exec.memoryKb} KB, Status: ${exec.compileStatus}`);

  if (exec.passedTests !== exec.totalTests) {
    throw new Error('Working solution failed visible tests');
  }

  // 7. Test Final Submission against all test cases (including hidden)
  console.log('📋 7. Submitting solution for final verification & evaluation...');
  const submitRes = await axios.post(`${BASE_URL}/interviews/${interviewId}/submit`, {
    sourceCode: workingSolution,
    language: 'javascript',
    timeTakenSeconds: 980
  }, authHeaders);

  console.log(`   Final Submission: ${submitRes.data.execution.passedTests}/${submitRes.data.execution.totalTests} tests passed.`);
  console.log(`   Overall Score: ${submitRes.data.overallScore}/100, Verdict: "${submitRes.data.verdict}"`);

  // 8. Fetch Full Structured Evaluation
  const evalRes = await axios.get(`${BASE_URL}/interviews/${interviewId}/evaluation`, authHeaders);
  const evaluation = evalRes.data.evaluation;
  console.log(`✅ 8. Evaluation generated successfully!`);
  console.log(`   Category Scores:`, evaluation.categoryScores);
  console.log(`   Strengths:`, evaluation.strengths.slice(0, 2));
  console.log(`   Roadmap Recommendations:`, evaluation.roadmapRecommendations.slice(0, 1));

  // 9. Verify Dashboard Analytics
  const dashRes = await axios.get(`${BASE_URL}/analytics/dashboard`, authHeaders);
  console.log(`✅ 9. Dashboard Analytics: Completed Interviews: ${dashRes.data.metrics.totalInterviews}, Avg Score: ${dashRes.data.metrics.averageScore}/100`);

  // 10. Verify History
  const historyRes = await axios.get(`${BASE_URL}/analytics/history`, authHeaders);
  console.log(`✅ 10. History: ${historyRes.data.history.length} sessions logged.`);

  console.log('\n🎉 ALL 10 END-TO-END VERIFICATION STEPS PASSED PERFECTLY!\n');
}

runE2ETest().catch(err => {
  console.error('❌ E2E Test Failed:', err.response?.data || err.message);
  process.exit(1);
});

