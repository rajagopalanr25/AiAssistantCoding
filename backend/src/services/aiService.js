import axios from 'axios';
import { estimateTokens, calculateTokenStatus } from './tokenService.js';
import { AIInteraction, Interview } from '../models/index.js';

/**
 * Handle AI query from the candidate
 */
export async function generateAIResponse({
  interviewId,
  userId,
  message,
  type = 'chat', // 'chat' | 'hint' | 'debug' | 'complexity' | 'edge_cases' | 'interviewer_question'
  currentCode = '',
  problem,
  conversationHistory = [],
  hintLevel = 1
}) {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview session not found');
  }

  // Token enforcement
  const tokenStatus = calculateTokenStatus(interview.tokenBudget, interview.tokensUsed);
  if (tokenStatus.isExhausted) {
    const error = new Error('AI token budget has been exhausted. You may continue writing, running, and submitting your code independently.');
    error.statusCode = 403;
    error.code = 'TOKEN_BUDGET_EXHAUSTED';
    throw error;
  }

  // Build system prompt matching the assistance mode
  const systemPrompt = buildSystemPrompt({
    mode: interview.assistanceMode,
    problem,
    language: interview.language,
    type,
    hintLevel
  });

  const promptText = `
Problem: ${problem.title} (${problem.difficulty})
Language: ${interview.language}
Candidate's Current Code:
\`\`\`${interview.language}
${currentCode || '// No code written yet'}
\`\`\`

User Question / Request:
${message}
`;

  const estimatedInputTokens = estimateTokens(systemPrompt + promptText + JSON.stringify(conversationHistory.slice(-4)));

  // Ensure prompt doesn't instantly blow remaining tokens
  if (estimatedInputTokens > tokenStatus.remainingTokens && tokenStatus.remainingTokens < 20) {
    const error = new Error('Remaining token budget is insufficient for this AI request.');
    error.statusCode = 403;
    error.code = 'INSUFFICIENT_TOKENS';
    throw error;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  let assistantResponse = '';
  let inputTokens = estimatedInputTokens;
  let outputTokens = 0;
  let isSimulated = false;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        { role: 'user', content: promptText }
      ];

      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const maxTokensAllowed = Math.min(600, tokenStatus.remainingTokens);

      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages,
          max_tokens: maxTokensAllowed,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 25000
        }
      );

      assistantResponse = res.data.choices[0].message.content.trim();
      inputTokens = res.data.usage?.prompt_tokens || estimatedInputTokens;
      outputTokens = res.data.usage?.completion_tokens || estimateTokens(assistantResponse);
      isSimulated = false;
    } catch (err) {
      console.warn(`[AI Service] OpenAI API error: ${err.message}. Falling back to deterministic demo response.`);
      const sim = generateDeterministicResponse({
        type,
        message,
        problem,
        language: interview.language,
        mode: interview.assistanceMode,
        currentCode,
        hintLevel
      });
      assistantResponse = sim.text;
      inputTokens = estimatedInputTokens;
      outputTokens = estimateTokens(assistantResponse);
      isSimulated = true;
    }
  } else {
    // Deterministic simulation mode (Section 17: Clearly labelled demo mode)
    const sim = generateDeterministicResponse({
      type,
      message,
      problem,
      language: interview.language,
      mode: interview.assistanceMode,
      currentCode,
      hintLevel
    });
    assistantResponse = `[Simulated AI - Demo Mode]\n\n${sim.text}`;
    inputTokens = estimatedInputTokens;
    outputTokens = estimateTokens(assistantResponse);
    isSimulated = true;
  }

  // Calculate total tokens for this exchange, capped by remaining budget
  const actualUsedTokens = Math.min(inputTokens + outputTokens, tokenStatus.remainingTokens);
  const updatedTokensUsed = interview.tokensUsed + actualUsedTokens;
  const newRemaining = Math.max(0, interview.tokenBudget - updatedTokensUsed);

  // Update interview token counters
  await Interview.findByIdAndUpdate(interviewId, {
    tokensUsed: updatedTokensUsed,
    remainingTokens: newRemaining
  });

  // Record interaction log
  const interaction = await AIInteraction.create({
    interviewId,
    userId,
    type,
    userMessage: message,
    assistantResponse,
    inputTokens,
    outputTokens,
    totalTokens: actualUsedTokens,
    remainingBudget: newRemaining,
    isSimulated
  });

  const updatedStatus = calculateTokenStatus(interview.tokenBudget, updatedTokensUsed);

  return {
    interactionId: interaction._id,
    response: assistantResponse,
    type,
    tokens: {
      inputTokens,
      outputTokens,
      totalThisRequest: actualUsedTokens,
      budget: interview.tokenBudget,
      tokensUsed: updatedTokensUsed,
      remainingTokens: newRemaining,
      usagePercentage: updatedStatus.usagePercentage,
      warningLevel: updatedStatus.warningLevel,
      isExhausted: updatedStatus.isExhausted
    },
    isSimulated
  };
}

/**
 * Builds instructions matching the selected assistance mode
 */
function buildSystemPrompt({ mode, problem, language, type, hintLevel }) {
  const baseInstruction = `You are an elite Senior Staff Technical Interviewer and Coding Mentor at CodeArena AI conducting a live coding interview in ${language}.
Problem: ${problem.title}.
Problem Description: ${problem.description}.
Constraints: ${problem.constraints ? problem.constraints.join(', ') : 'None'}.
`;

  let modeRule = '';
  switch (mode) {
    case 'strict':
      modeRule = `
ASSISTANCE MODE: STRICT INTERVIEW MODE.
- NEVER write complete solutions, functions, or full blocks of working code.
- Guide the candidate using the Socratic method with targeted technical questions.
- Challenge their invariant reasoning, complexity expectations, and edge-case assumptions.
- Encourage them to articulate their data structure choices and write code independently.`;
      break;

    case 'limited_hints':
      modeRule = `
ASSISTANCE MODE: LIMITED HINTS MODE (Current Ladder Level: ${hintLevel}/4).
- Provide progressive guidance corresponding strictly to hint level ${hintLevel}:
  - Level 1: Conceptual direction only (no data structures or algorithms revealed).
  - Level 2: Relevant data structure recommendation.
  - Level 3: Algorithmic approach (e.g. two-pointer, sliding window, dynamic programming).
  - Level 4: Pseudocode blueprint.
- Never jump ahead or provide full solution code.`;
      break;

    case 'advanced':
      modeRule = `
ASSISTANCE MODE: ADVANCED AI ASSISTANT.
- Provide comprehensive algorithm breakdowns, mathematical proofs, time/space trade-offs.
- Point out micro-optimizations, cache locality, and alternative architectures.
- Review their written code line by line and point out bottlenecks.`;
      break;

    case 'standard':
    default:
      modeRule = `
ASSISTANCE MODE: STANDARD AI ASSISTANT.
- Explain core concepts, identify bugs in candidate code, and guide debugging.
- You may provide small partial code snippets or syntax guidance, but let the candidate implement the main logic.`;
      break;
  }

  return `${baseInstruction}\n${modeRule}\nMaintain a supportive, crisp, and professional interview tone. Avoid fluff.`;
}

/**
 * Deterministic responses for offline demo mode
 */
function generateDeterministicResponse({ type, message, problem, language, mode, currentCode, hintLevel }) {
  const lowerMsg = (message || '').toLowerCase();

  // Hint ladder requested
  if (type === 'hint') {
    const hintObj = problem.hints?.find(h => h.level === hintLevel) || problem.hints?.[0] || {
      title: "Guidance",
      content: "Consider the relation between constraints and the required time complexity."
    };
    return {
      text: `### 💡 ${hintObj.title} (Level ${hintLevel}/4)\n\n${hintObj.content}\n\n*Think through how this applies to your current approach before moving to the next level.*`
    };
  }

  // Debugging requested
  if (type === 'debug' || lowerMsg.includes('debug') || lowerMsg.includes('error') || lowerMsg.includes('bug')) {
    if (!currentCode || currentCode.trim().length < 40) {
      return {
        text: `I notice your code is still very brief or at the starter template stage. \n\nTo help you debug effectively:\n1. State your proposed algorithm in comments first.\n2. Initialize your primary data structures (such as a map, stack, or pointers).\n3. Test the primary base case or loop termination condition.`
      };
    }
    return {
      text: `### 🔍 Code Diagnostics for ${problem.title}\n\n1. **Boundary & Initialization Check**: Ensure indices and default pointers match 0-indexed bounds.\n2. **State Updates**: Check whether your loop variables or hash map updates happen before or after the condition check.\n3. **Return Type**: Confirm that your return value matches \`${problem.outputFormat}\` for all code paths including empty or terminal states.`
    };
  }

  // Complexity review requested
  if (type === 'complexity' || lowerMsg.includes('complexity') || lowerMsg.includes('big o')) {
    return {
      text: `### ⏱️ Complexity Expectations for ${problem.title}\n\n- **Target Time Complexity**: Optimal solutions for this problem typically achieve **O(N)** or **O(N log N)** depending on constraints.\n- **Target Space Complexity**: Aim for **O(1)** auxiliary space if in-place, or **O(N)** if using an auxiliary hash map or stack.\n\n*How does your current approach compare to these bounds?*`
    };
  }

  // Edge cases requested
  if (type === 'edge_cases' || lowerMsg.includes('edge case')) {
    return {
      text: `### 🛡️ Critical Edge Cases to Consider:\n\n1. **Empty / Minimal Input**: What happens when the input size is at its minimum constraint (${problem.constraints?.[0] || 'length 0 or 1'})?\n2. **Duplicate Elements**: Does your logic account for repeated values or identical keys?\n3. **Extreme Values**: Are there negative numbers, zeroes, or large values up to $10^9$ that could affect calculations?\n4. **Ordering Invariants**: What if elements are already sorted or completely reversed?`
    };
  }

  // Interviewer follow-up question
  if (type === 'interviewer_question') {
    const questions = [
      `Could you explain the trade-offs of your chosen data structure compared to an alternative like an array or heap?`,
      `What would happen to the runtime and memory footprint if the input size increased from $10^4$ to $10^7$ elements?`,
      `How would you refactor this to handle streaming data where elements arrive one by one?`,
      `Can you walk me through an invariant that holds true after each iteration of your main loop?`
    ];
    const picked = questions[Math.floor(Math.random() * questions.length)];
    return {
      text: `### 🎙️ Technical Interviewer Follow-up\n\n> *"${picked}"*\n\nTake a moment to reason through your answer and reply in the chat.`
    };
  }

  // Default context response
  if (mode === 'strict') {
    return {
      text: `In this strict interview format, let's step back and analyze: What is the primary bottleneck in your current mental model? \n\nConsider what invariant you are maintaining as you traverse the data. Can you formulate the subproblem in plain English before writing the code?`
    };
  }

  return {
    text: `To solve **${problem.title}** effectively in ${language}:\n\n1. Analyze the input format: \`${problem.inputFormat}\`.\n2. Consider the optimal pattern (e.g. Hash Map lookup, Sliding Window, or Two Pointers).\n3. Keep your helper variables clear and handle edge cases early.\n\nWhat approach do you plan to use? I'm here to review your logic as you write!`
  };
}

