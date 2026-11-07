import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  InterviewSession,
  ProblemDetail,
  TokenStatus,
  AIInteractionItem,
  ExecutionResult,
  Language,
} from '../types';
import { ProblemPanel } from '../components/workspace/ProblemPanel';
import { EditorPanel } from '../components/workspace/EditorPanel';
import { AssistantPanel } from '../components/workspace/AssistantPanel';
import { ConsolePanel } from '../components/workspace/ConsolePanel';
import { SubmitModal } from '../components/workspace/SubmitModal';
import { TokenBadge } from '../components/common/TokenBadge';
import {
  Code2,
  Clock,
  ChevronLeft,
  Zap,
  Play,
  Send,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<InterviewSession | null>(null);
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [tokens, setTokens] = useState<TokenStatus | null>(null);
  const [interactions, setInteractions] = useState<AIInteractionItem[]>([]);
  const [code, setCode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [language, setLanguage] = useState<Language>('javascript');

  // Execution & UI state
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Collapsible panels
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState<number>(0);

  // Fetch initial session
  useEffect(() => {
    async function loadSession() {
      if (!id) return;
      try {
        const res = await api.getInterview(id);
        setInterview(res.interview);
        setProblem(res.problem);
        setTokens(res.tokens);
        setInteractions(res.interactions || []);
        setCode(res.interview.codeDraft || res.problem?.starterCode?.[res.interview.language as Language] || '');
        setNotes(res.interview.notes || '');
        setLanguage(res.interview.language as Language);

        const totalDurationSecs = (res.interview.durationMinutes || 45) * 60;
        const elapsed = res.interview.timeElapsedSeconds || 0;
        setTimeElapsedSeconds(elapsed);
        setSecondsRemaining(Math.max(0, totalDurationSecs - elapsed));
      } catch (err: any) {
        console.error('Failed to load workspace:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id, navigate]);

  // Timer Countdown interval
  useEffect(() => {
    if (loading || !interview || interview.status === 'completed') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, interview]);

  // Periodic Auto-save draft every 15 seconds
  useEffect(() => {
    if (!id || loading) return;

    const interval = setInterval(async () => {
      try {
        setAutoSaveStatus('saving');
        await api.saveDraft(id, {
          codeDraft: code,
          notes,
          timeElapsedSeconds,
        });
        setAutoSaveStatus('saved');
      } catch (err) {
        console.warn('Auto-save failed:', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id, code, notes, timeElapsedSeconds, loading]);

  // Code Execution (Run against sample test cases)
  const handleRunCode = async () => {
    if (!id || isRunning) return;
    setIsRunning(true);
    setIsConsoleOpen(true);

    try {
      const res = await api.runCode(id, {
        sourceCode: code,
        language,
      });
      setExecution(res.execution);
    } catch (err: any) {
      setExecution({
        success: false,
        totalTests: problem?.testCases?.length || 0,
        passedTests: 0,
        failedTests: problem?.testCases?.length || 0,
        results: [],
        runtimeMs: 0,
        memoryKb: 0,
        compileStatus: 'ERROR',
        compileOutput: err.message || 'Execution failed',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (Run against all test cases + AI Evaluation)
  const handleConfirmSubmit = async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await api.submitInterview(id, {
        sourceCode: code,
        language,
        timeTakenSeconds: timeElapsedSeconds,
      });

      // Navigate to detailed result evaluation page
      navigate(`/interview/${id}/result`);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  // AI Assistant Query
  const handleSendMessage = async (message: string, type: string = 'chat', hintLevel: number = 1) => {
    if (!id || !tokens || tokens.isExhausted || isAssistantLoading) return;

    setIsAssistantLoading(true);

    try {
      const historyFormatted = interactions.map((i) => [
        { sender: 'user', content: i.userMessage },
        { sender: 'assistant', content: i.assistantResponse },
      ]).flat();

      const res = await api.askAI({
        interviewId: id,
        message,
        type,
        currentCode: code,
        conversationHistory: historyFormatted,
        hintLevel,
      });

      // Append interaction
      const newInteraction: AIInteractionItem = {
        id: res.interactionId,
        type: res.type as any,
        userMessage: message,
        assistantResponse: res.response,
        totalTokens: res.tokens.totalThisRequest,
        remainingBudget: res.tokens.remainingTokens,
        isSimulated: res.isSimulated,
        timestamp: new Date().toISOString(),
      };

      setInteractions((prev) => [...prev, newInteraction]);
      setTokens(res.tokens);
    } catch (err: any) {
      alert(`AI Assistant Error: ${err.message}`);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  // Reset code to starter stub
  const handleResetCode = () => {
    if (window.confirm('Reset code to the original starter template? Current edits will be lost.')) {
      const starter = problem?.starterCode?.[language] || '';
      setCode(starter);
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-950 text-slate-300 space-y-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-slate-400">Loading interview sandbox environment...</p>
      </div>
    );
  }

  if (!interview || !problem || !tokens) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950 text-slate-300">
        <p>Interview session could not be loaded.</p>
      </div>
    );
  }

  const isTimerLow = secondsRemaining < 300 && secondsRemaining > 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-dark-950 overflow-hidden select-none">
      
      {/* Workspace Top Toolbar */}
      <header className="h-14 border-b border-slate-800 bg-dark-900/90 px-4 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Back Link & Problem Info */}
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-100 tracking-tight">
              {problem.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {interview.difficulty}
            </span>
          </div>
        </div>

        {/* Center: Live Timer Countdown */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold ${
              isTimerLow
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-dark-950 border-slate-800 text-slate-300'
            }`}
            title="Interview Session Timer"
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerLow ? 'text-rose-400' : 'text-purple-400'}`} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        {/* Right: Token Budget & Submit Button */}
        <div className="flex items-center space-x-3">
          <TokenBadge tokens={tokens} interviewId={id} />

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </header>

      {/* Main 3-Panel Split Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* Left Panel: Problem Description & Notes */}
        <div
          className={`transition-all duration-200 h-full ${
            isLeftCollapsed ? 'w-12' : 'w-full md:w-[320px] lg:w-[380px] shrink-0'
          }`}
        >
          <ProblemPanel
            problem={problem}
            notes={notes}
            onNotesChange={setNotes}
            isCollapsed={isLeftCollapsed}
            onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
          />
        </div>

        {/* Center Panel: Code Editor + Bottom Console */}
        <div className="flex-1 flex flex-col min-w-0 h-full border-r border-slate-800">
          <div className="flex-1 min-h-0">
            <EditorPanel
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onRunCode={handleRunCode}
              onSubmit={() => setIsSubmitModalOpen(true)}
              onResetCode={handleResetCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              toggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
              isConsoleOpen={isConsoleOpen}
              autoSaveStatus={autoSaveStatus}
            />
          </div>

          {/* Collapsible Bottom Console */}
          {isConsoleOpen && (
            <ConsolePanel
              execution={execution}
              isRunning={isRunning}
              onClose={() => setIsConsoleOpen(false)}
            />
          )}
        </div>

        {/* Right Panel: AI Coding Assistant */}
        <div
          className={`transition-all duration-200 h-full ${
            isRightCollapsed ? 'w-12' : 'w-full md:w-[340px] lg:w-[410px] shrink-0'
          }`}
        >
          <AssistantPanel
            interviewId={id!}
            assistanceMode={interview.assistanceMode}
            tokens={tokens}
            interactions={interactions}
            onSendMessage={handleSendMessage}
            isLoading={isAssistantLoading}
            isCollapsed={isRightCollapsed}
            onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
          />
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <SubmitModal
          tokens={tokens}
          timeElapsedSeconds={timeElapsedSeconds}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setIsSubmitModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

