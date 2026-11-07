import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Language, Difficulty, AssistanceMode, InterviewMode, ProblemSummary } from '../types';
import {
  Sparkles,
  Terminal,
  Zap,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  Info,
  Check,
  Code2,
  Cpu
} from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialProblemSlug = searchParams.get('problem') || '';

  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration options
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [tokenBudget, setTokenBudget] = useState<number>(2000);
  const [customTokens, setCustomTokens] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [assistanceMode, setAssistanceMode] = useState<AssistanceMode>('standard');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('mock_interview');

  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      try {
        const res = await api.getProblems();
        setProblems(res.problems);

        if (initialProblemSlug) {
          const matched = res.problems.find(p => p.slug === initialProblemSlug);
          if (matched) setSelectedProblemId(matched.id);
          else if (res.problems.length > 0) setSelectedProblemId(res.problems[0].id);
        } else if (res.problems.length > 0) {
          setSelectedProblemId(res.problems[0].id);
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, [initialProblemSlug]);

  const selectedProblem = problems.find(p => p.id === selectedProblemId);

  const handleLaunch = async () => {
    if (!selectedProblemId || isStarting) return;
    setIsStarting(true);

    const finalTokens = customTokens ? Math.max(100, parseInt(customTokens, 10)) : tokenBudget;
    const finalDuration = customDuration ? Math.max(5, parseInt(customDuration, 10)) : durationMinutes;

    try {
      const res = await api.startInterview({
        problemId: selectedProblemId,
        language,
        tokenBudget: finalTokens,
        durationMinutes: finalDuration,
        assistanceMode,
        interviewMode
      });

      navigate(`/interview/${res.interviewId}`);
    } catch (err: any) {
      alert(`Failed to start interview: ${err.message}`);
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-400 font-mono text-xs">
        Loading problem catalog and runtime environment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Session Configuration
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Configure Your AI Interview Simulation
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Choose your algorithmic problem, set token quotas, configure duration, and select your AI interviewer assistance profile.
          </p>
        </div>

        {/* Configuration Matrix Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Settings Controls */}
          <div className="md:col-span-2 space-y-6">
            
            {/* 1. Problem Selection */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>1. Select Coding Problem ({problems.length} Available)</span>
              </label>

              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.difficulty}) - {p.topics.slice(0, 2).join(', ')}
                  </option>
                ))}
              </select>

              {selectedProblem && (
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-purple-300">{selectedProblem.title}: </span>
                  {selectedProblem.descriptionSnippet}
                </div>
              )}
            </div>

            {/* 2. Programming Language */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>2. Select Programming Language</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'javascript', label: 'JavaScript', sub: 'Node.js 20' },
                  { id: 'python', label: 'Python', sub: 'Python 3.10' },
                  { id: 'java', label: 'Java', sub: 'OpenJDK 17' },
                  { id: 'cpp', label: 'C++', sub: 'GCC / C++17' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id as Language)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      language === lang.id
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                        : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <p className="text-xs font-bold">{lang.label}</p>
                    <p className="text-[10px] font-mono opacity-60 mt-0.5">{lang.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. AI Token Allowance */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>3. AI Token Allowance</span>
                </label>
                <span className="text-[11px] font-mono text-purple-400">Strict quota</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[500, 1000, 2000, 3000, 5000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTokenBudget(t);
                      setCustomTokens('');
                    }}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      tokenBudget === t && !customTokens
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                        : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-mono">{t.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Or specify custom tokens (e.g. 2500)"
                value={customTokens}
                onChange={(e) => setCustomTokens(e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* 4. Duration */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>4. Interview Duration</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { mins: 15, label: '15 mins', sub: 'Speed Run' },
                  { mins: 30, label: '30 mins', sub: 'Screening' },
                  { mins: 45, label: '45 mins', sub: 'Standard' },
                  { mins: 60, label: '60 mins', sub: 'Deep Dive' }
                ].map((dur) => (
                  <button
                    key={dur.mins}
                    type="button"
                    onClick={() => {
                      setDurationMinutes(dur.mins);
                      setCustomDuration('');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      durationMinutes === dur.mins && !customDuration
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                        : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold">{dur.label}</p>
                    <p className="text-[10px] opacity-60 font-mono">{dur.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Assistance Mode */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>5. AI Assistance Mode</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'strict',
                    title: 'Strict Interview Mode',
                    desc: 'No code solutions. Socratic questions and invariant challenges only.'
                  },
                  {
                    id: 'limited_hints',
                    title: 'Limited Hints Ladder',
                    desc: 'Progressive hints across 4 levels (Concept → Structure → Algorithm → Pseudocode).'
                  },
                  {
                    id: 'standard',
                    title: 'Standard AI Assistant',
                    desc: 'Concept explanations, error debugging, and partial logic suggestions.'
                  },
                  {
                    id: 'advanced',
                    title: 'Advanced AI Assistant',
                    desc: 'Deep algorithm analysis, asymptotic trade-offs, and alternative architectures.'
                  }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAssistanceMode(m.id as AssistanceMode)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      assistanceMode === m.id
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                        : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-200">{m.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pre-flight Summary Card */}
          <div className="space-y-6">
            <div className="glass-panel-elevated rounded-2xl p-6 space-y-5 sticky top-24">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Pre-flight Summary
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Problem:</span>
                  <span className="font-semibold text-slate-100 truncate max-w-[150px]">
                    {selectedProblem?.title || 'Selected Problem'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Difficulty:</span>
                  <span className="font-mono font-semibold text-purple-400">
                    {selectedProblem?.difficulty || 'Medium'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Language:</span>
                  <span className="font-mono font-semibold text-blue-400 uppercase">
                    {language}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">AI Budget:</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {(customTokens ? parseInt(customTokens, 10) : tokenBudget).toLocaleString()} tokens
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {customDuration || durationMinutes} minutes
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Assistance:</span>
                  <span className="font-semibold text-purple-300 capitalize">
                    {assistanceMode.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLaunch}
                  disabled={isStarting}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-purple transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isStarting ? 'Initializing Environment...' : 'Start Interview Session'}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Tokens and time will begin counting down once you enter the Monaco coding sandbox.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

