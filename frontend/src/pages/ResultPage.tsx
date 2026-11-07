import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { EvaluationResult } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Clock,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  BookOpen,
  Compass,
  FileCheck,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [interview, setInterview] = useState<any>(null);
  const [problem, setProblem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'code' | 'roadmap'>('overview');

  useEffect(() => {
    async function loadResult() {
      if (!id) return;
      try {
        const res = await api.getEvaluation(id);
        setEvaluation(res.evaluation);
        setSubmission(res.submission);
        setInterview(res.interview);
        setProblem(res.problem);

        // Fire celebratory confetti if score >= 70
        if (res.evaluation?.overallScore >= 70) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Failed to load evaluation:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950 text-slate-300 space-y-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-slate-400">Synthesizing interview assessment matrix...</p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950 text-slate-300 space-y-4">
        <p>Evaluation report not found.</p>
        <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Strong Performance':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Average':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const categories = [
    { key: 'problemUnderstanding', label: 'Problem Understanding' },
    { key: 'algorithmSelection', label: 'Algorithm Selection' },
    { key: 'codeCorrectness', label: 'Code Correctness' },
    { key: 'timeComplexity', label: 'Time Complexity' },
    { key: 'spaceComplexity', label: 'Space Complexity' },
    { key: 'codeQuality', label: 'Code Quality' },
    { key: 'edgeCaseHandling', label: 'Edge-Case Handling' },
    { key: 'independentProblemSolving', label: 'Independent Solving' },
    { key: 'aiUtilizationEfficiency', label: 'AI Efficiency' },
    { key: 'communicationAndReasoning', label: 'Communication' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Evaluation Report
              </span>
              <span className="text-xs font-mono text-slate-400">
                Session ID: {id?.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {interview?.problemTitle || 'Technical Interview Assessment'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Completed on {new Date(evaluation.createdAt).toLocaleDateString()} in {interview?.language?.toUpperCase()} • {interview?.difficulty} Difficulty
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center space-x-6 z-10">
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">OVERALL SCORE</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {evaluation.overallScore}
                </span>
                <span className="text-sm font-semibold text-slate-500">/100</span>
              </div>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold border ${getVerdictStyle(evaluation.verdict)}`}>
                {evaluation.verdict}
              </span>
            </div>

            <div className="flex flex-col space-y-2 print:hidden">
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-medium"
                title="Print or Export as PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <Link
                to="/interview/setup"
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center space-x-1.5 text-xs font-medium shadow-glow-purple"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">New Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 print:hidden">
          {[
            { id: 'overview', label: 'Score Breakdown', icon: Trophy },
            { id: 'analysis', label: 'Deep Technical Analysis', icon: BrainCircuit },
            { id: 'code', label: 'Submitted Solution', icon: Code2 },
            { id: 'roadmap', label: 'Learning Roadmap', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview Score Breakdown */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 10-Category Score Grid */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>10-Category Evaluation Matrix (/10 Each)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {categories.map((cat) => {
                  const score = (evaluation.categoryScores as any)?.[cat.key] || 0;
                  return (
                    <div
                      key={cat.key}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-medium text-slate-300 leading-tight">
                          {cat.label}
                        </span>
                        <span className="text-sm font-black font-mono text-purple-400">
                          {score}/10
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Weaknesses Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="glass-panel rounded-2xl p-6 border-emerald-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths Identified</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="glass-panel rounded-2xl p-6 border-rose-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Areas for Improvement</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {evaluation.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Usage & Independence Analysis */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>AI Mentorship & Dependency Metrics</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">AI PROMPTS</span>
                  <p className="text-base font-bold text-slate-100 mt-0.5">
                    {evaluation.aiUsageAnalysis.totalAiRequests}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">TOKENS CONSUMED</span>
                  <p className="text-base font-bold text-purple-400 mt-0.5">
                    {evaluation.aiUsageAnalysis.tokensConsumed.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">HINTS ACCESSED</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">
                    {evaluation.aiUsageAnalysis.hintsRequested}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">AI DEPENDENCY</span>
                  <p className="text-base font-bold text-blue-400 mt-0.5">
                    {evaluation.aiUsageAnalysis.aiDependencyScore}%
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-purple-300">Interviewer Verdict: </span>
                <span>{evaluation.aiUsageAnalysis.aiEfficiencyVerdict}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deep Technical Analysis */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Approach Analysis */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4" />
                <span>1. Approach Analysis</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.approachAnalysis.algorithmExplanation}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Chosen Paradigm</span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">
                    {evaluation.approachAnalysis.chosenApproach}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Optimal Convergence</span>
                  <p className={`text-xs font-semibold mt-0.5 ${evaluation.approachAnalysis.isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {evaluation.approachAnalysis.isOptimal ? 'Optimal Solution' : 'Sub-Optimal / Alternative Possible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>2. Asymptotic Complexity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Time Complexity</span>
                  <p className="text-sm font-bold font-mono text-purple-300">
                    {evaluation.complexityAnalysis.timeComplexity}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Auxiliary Space</span>
                  <p className="text-sm font-bold font-mono text-blue-300">
                    {evaluation.complexityAnalysis.spaceComplexity}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                <span className="font-semibold text-slate-300">Optimizations: </span>
                {evaluation.complexityAnalysis.possibleOptimizations}
              </p>
            </div>

            {/* Code Quality Analysis */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                <FileCheck className="w-4 h-4" />
                <span>3. Code Quality & Modularity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Modularity</span>
                  <p className="text-slate-300 mt-1">{evaluation.codeQualityAnalysis.modularity}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Naming Conventions</span>
                  <p className="text-slate-300 mt-1">{evaluation.codeQualityAnalysis.namingConventions}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Maintainability</span>
                  <p className="text-slate-300 mt-1">{evaluation.codeQualityAnalysis.maintainability}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Submitted Code Snapshot */}
        {activeTab === 'code' && (
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Immutable Submitted Code Snapshot</span>
              </h3>
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase">
                {submission?.language || interview?.language}
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
              {submission?.sourceCode || '// No code found in submission record'}
            </pre>

            {submission?.executionResults && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Test Cases Passed: {submission.testCasesPassed} / {submission.totalTestCases}</span>
                <span>Runtime: {submission.executionTime}ms</span>
                <span>Memory: {submission.memoryUsage} KB</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Personalized Learning Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Custom Tailored Engineering Roadmap</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Based on your performance in {interview?.problemTitle}, these targeted practice tracks will address gaps in algorithmic rigor, asymptotic bounds, and edge case resilience.
              </p>

              <div className="space-y-3 pt-2">
                {evaluation.roadmapRecommendations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                        {item.topic}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Track #{idx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.reason}</p>
                    <p className="text-xs text-slate-200 font-medium pt-1">
                      <span className="text-purple-400 font-semibold">Recommended Action: </span>
                      {item.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Interviewer Actionable Recommendations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

