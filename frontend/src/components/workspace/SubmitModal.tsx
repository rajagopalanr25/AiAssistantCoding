import React from 'react';
import { TokenStatus } from '../../types';
import { Send, AlertCircle, Clock, Zap, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface SubmitModalProps {
  tokens: TokenStatus;
  timeElapsedSeconds: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  tokens,
  timeElapsedSeconds,
  onConfirm,
  onCancel,
  isSubmitting,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-elevated border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Confirm Final Submission</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Text */}
        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          Are you ready to submit your coding solution? Once submitted, your final code snapshot will be locked, verified against all hidden edge cases, and evaluated across 10 technical categories.
        </p>

        {/* Session Snapshot Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800 flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Time Taken</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{formatTime(timeElapsedSeconds)}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800 flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">AI Tokens Used</span>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{tokens.tokensUsed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1">
          <p className="font-semibold text-purple-100 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Comprehensive Evaluation Generation</span>
          </p>
          <p className="text-[11px] text-purple-300/80">
            You will immediately receive structured category scores (/100), algorithmic breakdown, and a personalized learning roadmap.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating Submission...' : 'Confirm Submission'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

