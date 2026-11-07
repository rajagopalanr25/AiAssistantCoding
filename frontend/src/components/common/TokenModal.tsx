import React, { useEffect, useState } from 'react';
import { TokenStatus } from '../../types';
import { api } from '../../services/api';
import { X, Zap, AlertTriangle, AlertCircle, ShieldAlert, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TokenModalProps {
  interviewId: string;
  tokens: TokenStatus;
  onClose: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({ interviewId, tokens, onClose }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await api.getTokenStatus(interviewId);
        if (res.history) {
          setHistory(res.history);
        }
      } catch (err) {
        console.error('Failed to load token history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, [interviewId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-elevated border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">AI Token Budget Ledger</h3>
              <p className="text-xs text-slate-400">Real-time accounting of model tokens and usage quotas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banners */}
        {tokens.warningLevel === 'exhausted' && (
          <div className="my-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-start space-x-3 text-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-rose-100">AI Token Budget Fully Exhausted (100%)</p>
              <p className="opacity-90 mt-0.5">Further AI queries are disabled. You may continue writing, testing, and submitting your solution independently without penalty.</p>
            </div>
          </div>
        )}

        {tokens.warningLevel === 'critical' && (
          <div className="my-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 flex items-start space-x-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-red-100">Critical Token Threshold Reached (&ge; 90%)</p>
              <p className="opacity-90 mt-0.5">You have consumed over 90% of your allocated interview budget. Preserve remaining tokens for essential final reviews.</p>
            </div>
          </div>
        )}

        {tokens.warningLevel === 'warning' && (
          <div className="my-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-start space-x-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-amber-100">Token Warning Threshold (&ge; 75%)</p>
              <p className="opacity-90 mt-0.5">You have utilized three quarters of your token allowance.</p>
            </div>
          </div>
        )}

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">INITIAL BUDGET</span>
            <p className="text-lg font-bold text-slate-100 mt-0.5">{tokens.tokenBudget.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">CONSUMED</span>
            <p className="text-lg font-bold text-purple-400 mt-0.5">{tokens.tokensUsed.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">REMAINING</span>
            <p className={`text-lg font-bold mt-0.5 ${tokens.remainingTokens <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {tokens.remainingTokens.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">UTILIZATION</span>
            <p className="text-lg font-bold text-slate-100 mt-0.5">{tokens.usagePercentage}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Quota Progression</span>
            <span>{tokens.tokensUsed} / {tokens.tokenBudget} tokens</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                tokens.warningLevel === 'exhausted'
                  ? 'bg-rose-500'
                  : tokens.warningLevel === 'critical'
                  ? 'bg-red-500'
                  : tokens.warningLevel === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}
              style={{ width: `${Math.min(100, tokens.usagePercentage)}%` }}
            />
          </div>
        </div>

        {/* Interaction Ledger */}
        <div className="border-t border-slate-800 pt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Usage History ({history.length} Requests)</span>
          </h4>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading token ledger...</div>
          ) : history.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No AI queries initiated yet. Your full budget remains available.
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {item.type}
                    </span>
                    <span className="text-slate-300 truncate max-w-xs font-sans">
                      {item.userMessage}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 text-slate-400">
                    <span title="Input + Output" className="text-purple-300 font-semibold">
                      +{item.totalTokens} tokens
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Balance: {item.remainingBudget}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
};

