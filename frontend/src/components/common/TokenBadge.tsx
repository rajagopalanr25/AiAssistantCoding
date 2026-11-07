import React, { useState } from 'react';
import { TokenStatus } from '../../types';
import { Zap, AlertTriangle, AlertCircle, ShieldAlert, History } from 'lucide-react';
import { TokenModal } from './TokenModal';

interface TokenBadgeProps {
  tokens: TokenStatus;
  interviewId?: string;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({ tokens, interviewId }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Status visual styles
  const isWarning = tokens.warningLevel === 'warning';
  const isCritical = tokens.warningLevel === 'critical';
  const isExhausted = tokens.warningLevel === 'exhausted' || tokens.remainingTokens <= 0;

  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700/80';
  let iconColor = 'text-purple-400';
  let progressBg = 'bg-purple-500';

  if (isExhausted) {
    badgeColor = 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-rose-950';
    iconColor = 'text-rose-400 animate-pulse';
    progressBg = 'bg-rose-500';
  } else if (isCritical) {
    badgeColor = 'bg-red-950/60 text-red-300 border-red-500/40';
    iconColor = 'text-red-400';
    progressBg = 'bg-red-500';
  } else if (isWarning) {
    badgeColor = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    iconColor = 'text-amber-400';
    progressBg = 'bg-amber-500';
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`group flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all hover:scale-[1.02] ${badgeColor}`}
        title="Click to view AI Token Budget Breakdown"
      >
        <div className="flex items-center space-x-1.5">
          {isExhausted ? (
            <ShieldAlert className={`w-3.5 h-3.5 ${iconColor}`} />
          ) : isCritical ? (
            <AlertCircle className={`w-3.5 h-3.5 ${iconColor}`} />
          ) : isWarning ? (
            <AlertTriangle className={`w-3.5 h-3.5 ${iconColor}`} />
          ) : (
            <Zap className={`w-3.5 h-3.5 ${iconColor}`} />
          )}
          <span className="font-semibold">
            {tokens.remainingTokens.toLocaleString()} / {tokens.tokenBudget.toLocaleString()}
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="w-14 h-1.5 bg-slate-700/60 rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full transition-all duration-500 ${progressBg}`}
            style={{ width: `${Math.min(100, tokens.usagePercentage)}%` }}
          />
        </div>

        <span className="font-sans text-[11px] opacity-80 group-hover:opacity-100 flex items-center space-x-1">
          <span>{tokens.usagePercentage}%</span>
          <History className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
        </span>
      </button>

      {modalOpen && interviewId && (
        <TokenModal
          interviewId={interviewId}
          tokens={tokens}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

