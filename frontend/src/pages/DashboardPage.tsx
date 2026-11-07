import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  History
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-400 font-mono text-xs">
        Loading candidate analytics engine...
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalInterviews: 0,
    averageScore: 0,
    problemsSolved: 0,
    averageTokensUsed: 0,
    codingAccuracy: 0,
    averageTimeMinutes: 0,
    aiDependencyScore: 0,
    improvementScore: 0
  };

  const charts = data?.charts || {
    performanceOverTime: [],
    tokenUsageTrend: [],
    languageDistribution: [],
    difficultyDistribution: [],
    categoryBreakdown: []
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Banner / Welcome & CTA */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Candidate Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">{user?.profile?.targetRole || 'Software Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Engineer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Track your algorithmic mastery, token budget efficiency, and technical interview progression.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/history"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-2"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Past Sessions</span>
            </Link>

            <Link
              to="/interview/setup"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-purple transition-all duration-200 hover:scale-[1.02] flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Start New Interview</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 8 Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {/* 1. Total Completed */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Interviews</span>
            <p className="text-xl font-black text-slate-100">{metrics.totalInterviews}</p>
            <span className="text-[10px] text-slate-500">Sessions</span>
          </div>

          {/* 2. Avg Score */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Avg Score</span>
            <p className="text-xl font-black text-purple-400">{metrics.averageScore}<span className="text-xs font-normal text-slate-500">/100</span></p>
            <span className="text-[10px] text-purple-300/80">Mean assessment</span>
          </div>

          {/* 3. Problems Solved */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Solved</span>
            <p className="text-xl font-black text-emerald-400">{metrics.problemsSolved}</p>
            <span className="text-[10px] text-emerald-300/80">100% tests</span>
          </div>

          {/* 4. Avg Token Consumption */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Avg Tokens</span>
            <p className="text-xl font-black text-blue-400">{metrics.averageTokensUsed.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Per session</span>
          </div>

          {/* 5. Coding Accuracy */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Accuracy</span>
            <p className="text-xl font-black text-emerald-400">{metrics.codingAccuracy}%</p>
            <span className="text-[10px] text-slate-500">Test pass rate</span>
          </div>

          {/* 6. Avg Time */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Avg Speed</span>
            <p className="text-xl font-black text-amber-400">{metrics.averageTimeMinutes}m</p>
            <span className="text-[10px] text-slate-500">Duration</span>
          </div>

          {/* 7. AI Dependency Score */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">AI Reliance</span>
            <p className="text-xl font-black text-indigo-400">{metrics.aiDependencyScore}%</p>
            <span className="text-[10px] text-slate-500">Independence</span>
          </div>

          {/* 8. Improvement Score */}
          <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Growth</span>
            <p className={`text-xl font-black ${metrics.improvementScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.improvementScore >= 0 ? `+${metrics.improvementScore}%` : `${metrics.improvementScore}%`}
            </p>
            <span className="text-[10px] text-slate-500">Progression</span>
          </div>
        </div>

        {/* Charts & Analytical Breakdown Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Performance Matrix (Radar/Bar) */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Skill Mastery Radar (10 Technical Dimensions)</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">Scale 0 - 10</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {charts.categoryBreakdown.map((cat: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-dark-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono font-bold text-purple-400">{cat.score} / 10</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${(cat.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Difficulty & Language Distribution */}
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span>Problem Difficulty Spread</span>
              </h3>
              <div className="space-y-2">
                {charts.difficultyDistribution.map((d: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-dark-950 border border-slate-800 text-xs">
                    <span className="font-medium text-slate-300">{d.difficulty}</span>
                    <span className="font-mono text-slate-400">{d.count} sessions</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Language Utilization</span>
              </h3>
              <div className="space-y-2">
                {charts.languageDistribution.length === 0 ? (
                  <p className="text-xs text-slate-500">No language distribution recorded yet.</p>
                ) : (
                  charts.languageDistribution.map((l: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-dark-950 border border-slate-800 text-xs">
                      <span className="font-medium text-slate-300">{l.name}</span>
                      <span className="font-mono text-purple-400 font-semibold">{l.count} sessions</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

