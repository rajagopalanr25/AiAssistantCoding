import React, { useState } from 'react';
import { ProblemDetail } from '../../types';
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Tag,
  HelpCircle,
  Edit3,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProblemPanelProps {
  problem: ProblemDetail;
  notes: string;
  onNotesChange: (notes: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  notes,
  onNotesChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'examples' | 'notes'>('description');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Difficulty badge styling
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Expert':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full w-12 bg-dark-900 border-r border-slate-800 flex flex-col items-center py-4 space-y-4 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Expand Problem Panel"
        >
          <ChevronRight className="w-5 h-5 text-purple-400" />
        </button>
        <div className="writing-vertical text-xs font-mono text-slate-400 uppercase tracking-widest rotate-180">
          {problem.title}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-900 border-r border-slate-800 overflow-hidden select-text">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-dark-950/60">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <h2 className="text-base font-bold text-slate-100 truncate" title={problem.title}>
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked ? 'text-amber-400 bg-amber-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Problem Bookmarked' : 'Bookmark Problem'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Collapse Problem Description"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-slate-800 bg-dark-900/60 text-xs font-medium shrink-0 space-x-4">
        <button
          onClick={() => setActiveTab('description')}
          className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'description'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Description</span>
        </button>

        <button
          onClick={() => setActiveTab('examples')}
          className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'examples'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Examples ({problem.examples?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'notes'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Candidate Notes</span>
        </button>
      </div>

      {/* Panel Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm text-slate-300 leading-relaxed">
        {activeTab === 'description' && (
          <>
            {/* Description Text */}
            <div className="prose prose-invert max-w-none text-slate-200 whitespace-pre-line text-sm leading-6">
              {problem.description}
            </div>

            {/* Input & Output Format */}
            {(problem.inputFormat || problem.outputFormat) && (
              <div className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                {problem.inputFormat && (
                  <div>
                    <span className="font-mono text-purple-400 font-semibold uppercase text-[10px]">INPUT FORMAT:</span>
                    <p className="font-mono text-slate-300 mt-0.5">{problem.inputFormat}</p>
                  </div>
                )}
                {problem.outputFormat && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="font-mono text-blue-400 font-semibold uppercase text-[10px]">OUTPUT FORMAT:</span>
                    <p className="font-mono text-slate-300 mt-0.5">{problem.outputFormat}</p>
                  </div>
                )}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Constraints:</h4>
                <ul className="space-y-1 pl-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs font-mono text-slate-300">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics & Tags */}
            {problem.topics && problem.topics.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Related Topics</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {problem.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            {problem.examples && problem.examples.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-semibold">
                  <span>Example {idx + 1}</span>
                </div>
                <div className="text-xs font-mono space-y-1">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Input:</span>
                    <pre className="p-2 rounded bg-dark-950 text-slate-200 overflow-x-auto mt-0.5 border border-slate-800">
                      {ex.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Output:</span>
                    <pre className="p-2 rounded bg-dark-950 text-emerald-300 overflow-x-auto mt-0.5 border border-slate-800">
                      {ex.output}
                    </pre>
                  </div>
                  {ex.explanation && (
                    <div className="pt-1 text-slate-400 font-sans text-xs">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Personal Scratchpad (Auto-saved)</span>
              <span className="text-[10px] font-mono text-purple-400">Private</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Jot down candidate reasoning, algorithmic invariants, edge cases to verify, or pseudocode here..."
              className="w-full h-80 p-3 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};

