import React, { useState, useRef, useEffect } from 'react';
import { AssistanceMode, TokenStatus, AIInteractionItem } from '../../types';
import { TokenBadge } from '../common/TokenBadge';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Bug,
  Gauge,
  ShieldAlert,
  ChevronDown,
  Terminal,
  Zap,
  RotateCcw,
  User,
  Lightbulb,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AssistantPanelProps {
  interviewId: string;
  assistanceMode: AssistanceMode;
  tokens: TokenStatus;
  interactions: AIInteractionItem[];
  onSendMessage: (message: string, type: string, hintLevel?: number) => Promise<void>;
  isLoading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  interviewId,
  assistanceMode,
  tokens,
  interactions,
  onSendMessage,
  isLoading,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [hintLevel, setHintLevel] = useState(1);
  const [showHintDropdown, setShowHintDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [interactions, isLoading]);

  const handleSend = async (msg?: string, type: string = 'chat', level?: number) => {
    const textToSend = msg || inputMessage;
    if (!textToSend.trim() || isLoading || tokens.isExhausted) return;

    setInputMessage('');
    await onSendMessage(textToSend, type, level || hintLevel);
  };

  const getModeLabel = (mode: AssistanceMode) => {
    switch (mode) {
      case 'strict':
        return { label: 'Strict Interview', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'limited_hints':
        return { label: 'Limited Hints Ladder', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'advanced':
        return { label: 'Advanced AI Architect', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'standard':
      default:
        return { label: 'Standard AI Mentor', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    }
  };

  const modeInfo = getModeLabel(assistanceMode);

  if (isCollapsed) {
    return (
      <div className="h-full w-12 bg-dark-900 border-l border-slate-800 flex flex-col items-center py-4 space-y-4 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Expand AI Assistant Panel"
        >
          <Bot className="w-5 h-5 text-purple-400" />
        </button>
        <div className="writing-vertical text-xs font-mono text-slate-400 uppercase tracking-widest">
          AI ASSISTANT
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-900 border-l border-slate-800 overflow-hidden">
      {/* Panel Top Header */}
      <div className="p-3.5 border-b border-slate-800 bg-dark-950/70 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-100">AI Coding Assistant</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${modeInfo.color}`}>
                {modeInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <TokenBadge tokens={tokens} interviewId={interviewId} />
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Collapse AI Assistant"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Pills Toolbar */}
      <div className="p-2 border-b border-slate-800/80 bg-dark-900/90 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
        {/* Hint Ladder with Level Picker */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowHintDropdown(!showHintDropdown)}
            disabled={tokens.isExhausted || isLoading}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Hint {hintLevel}/4</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showHintDropdown && (
            <div
              className="absolute left-0 mt-1 w-52 rounded-xl glass-panel-elevated p-2 shadow-2xl z-40 space-y-1"
              onMouseLeave={() => setShowHintDropdown(false)}
            >
              {[
                { lvl: 1, title: 'Level 1: Conceptual Direction' },
                { lvl: 2, title: 'Level 2: Data Structure' },
                { lvl: 3, title: 'Level 3: Algorithm Approach' },
                { lvl: 4, title: 'Level 4: Pseudocode' },
              ].map((h) => (
                <button
                  key={h.lvl}
                  onClick={() => {
                    setHintLevel(h.lvl);
                    setShowHintDropdown(false);
                    handleSend(`Please provide Hint Level ${h.lvl}`, 'hint', h.lvl);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    hintLevel === h.lvl ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {h.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Debug Action */}
        <button
          onClick={() => handleSend('Please inspect my code for logical bugs, syntax discrepancies, or edge case pitfalls.', 'debug')}
          disabled={tokens.isExhausted || isLoading}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors disabled:opacity-50 shrink-0"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          <span>Debug</span>
        </button>

        {/* Complexity Check */}
        <button
          onClick={() => handleSend('What are the expected Time and Space complexities for this problem, and how does my current approach scale?', 'complexity')}
          disabled={tokens.isExhausted || isLoading}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors disabled:opacity-50 shrink-0"
        >
          <Gauge className="w-3 h-3 text-blue-400" />
          <span>Complexity</span>
        </button>

        {/* Edge Cases */}
        <button
          onClick={() => handleSend('What critical edge cases or boundary conditions should I safeguard against?', 'edge_cases')}
          disabled={tokens.isExhausted || isLoading}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors disabled:opacity-50 shrink-0"
        >
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          <span>Edge Cases</span>
        </button>

        {/* Interviewer Question */}
        <button
          onClick={() => handleSend('Ask me a technical interviewer follow-up question regarding my approach or trade-offs.', 'interviewer_question')}
          disabled={tokens.isExhausted || isLoading}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Interviewer Prompt</span>
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {interactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-purple-400 shadow-glow-purple">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">AI Mentor Standing By</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Operating under <span className="font-semibold text-purple-300">{modeInfo.label}</span>. Use the quick pills above or ask any targeted question about your logic.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Initial AI Budget: {tokens.tokenBudget.toLocaleString()} tokens
            </div>
          </div>
        ) : (
          interactions.map((msg, index) => (
            <div key={msg.id || index} className="space-y-3">
              {/* User message */}
              <div className="flex items-start justify-end space-x-2">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-600/20 border border-purple-500/30 p-3 text-xs text-purple-100 shadow-sm leading-relaxed">
                  <p>{msg.userMessage}</p>
                </div>
                <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-md bg-dark-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-dark-950/90 border border-slate-800 p-3 text-xs text-slate-200 shadow-sm space-y-2 leading-relaxed">
                  <div className="prose prose-invert max-w-none text-xs whitespace-pre-wrap font-sans">
                    {msg.assistantResponse}
                  </div>

                  {/* Token deduction info */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="flex items-center space-x-1 text-purple-400">
                      <Zap className="w-2.5 h-2.5" />
                      <span>-{msg.totalTokens} tokens</span>
                    </span>
                    <span>Remaining: {msg.remainingBudget}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-md bg-dark-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-dark-950/90 border border-slate-800 px-3.5 py-2 text-xs text-slate-400 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Analyzing code and crafting guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Input Box */}
      <div className="p-3 border-t border-slate-800 bg-dark-950 shrink-0">
        {tokens.isExhausted ? (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>AI Token Budget Exhausted (100%). Continue coding, running tests, and submitting independently.</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI mentor for hints or code review..."
              disabled={isLoading || tokens.isExhausted}
              className="flex-1 bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading || tokens.isExhausted}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors shadow-glow-purple"
              title="Send to AI Assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

