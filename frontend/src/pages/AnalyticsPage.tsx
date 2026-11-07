import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Zap,
  Target,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-400 font-mono text-xs">
        Compiling technical performance analytics...
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Performance Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineering Skill Mastery & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Deep dive into algorithmic problem-solving accuracy, AI token efficiency, and competency growth.
          </p>
        </div>

        {/* Analytical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: 10 Dimensions */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>10 Core Technical Dimensions Rating</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {charts.categoryBreakdown?.map((cat: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-dark-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{cat.name}</span>
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

          {/* Card 2: AI Dependency Breakdown */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>AI Dependency Index</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures the degree to which you rely on AI assistance (hints, debugging, syntax queries) versus independent reasoning.
              </p>

              <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-center space-y-1">
                <span className="text-3xl font-black font-mono text-purple-400">
                  {metrics.aiDependencyScore}%
                </span>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">
                  {metrics.aiDependencyScore < 40 ? 'High Independence (Strong)' : 'Moderate AI Assistance'}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              Note: Technical interview loops prioritize candidates who demonstrate strong first-principles reasoning before requesting hints.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

