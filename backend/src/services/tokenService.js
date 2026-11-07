/**
 * Estimate token count based on GPT tokenization rules (~4 characters per token average in English/code)
 */
export function estimateTokens(text) {
  if (!text) return 0;
  // Code and structured text tend to have ~3.5 to 4 characters per token
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  // Blended estimation
  return Math.max(1, Math.ceil(chars / 3.8));
}

/**
 * Calculates current status and warning level for an interview session
 */
export function calculateTokenStatus(tokenBudget, tokensUsed) {
  const safeUsed = Math.min(tokensUsed, tokenBudget);
  const remaining = Math.max(0, tokenBudget - safeUsed);
  const percentage = tokenBudget > 0 ? Math.min(100, Math.round((safeUsed / tokenBudget) * 1000) / 10) : 100;

  let warningLevel = 'normal'; // 'normal' | 'warning' (>=75%) | 'critical' (>=90%) | 'exhausted' (>=100%)
  if (percentage >= 100 || remaining <= 0) {
    warningLevel = 'exhausted';
  } else if (percentage >= 90) {
    warningLevel = 'critical';
  } else if (percentage >= 75) {
    warningLevel = 'warning';
  }

  return {
    tokenBudget,
    tokensUsed: safeUsed,
    remainingTokens: remaining,
    usagePercentage: percentage,
    warningLevel,
    isExhausted: remaining <= 0
  };
}

/**
 * Deduct tokens safely from interview balance
 */
export function deductTokens({ currentBudget, currentUsed, tokensToAdd }) {
  const newTokensUsed = currentUsed + tokensToAdd;
  const remaining = Math.max(0, currentBudget - newTokensUsed);
  return {
    tokensUsed: Math.min(newTokensUsed, currentBudget),
    remainingTokens: remaining
  };
}

