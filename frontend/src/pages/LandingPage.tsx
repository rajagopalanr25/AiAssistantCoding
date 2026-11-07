import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  BrainCircuit,
  Trophy,
  ArrowRight,
  Layers,
  Cpu,
  Clock,
  Compass,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-600/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-purple-500/30 text-xs text-purple-300 shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium">The Next-Generation AI-Assisted Interview Sandbox</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          Master Coding Interviews with an{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
            AI Mentor & Token Quota
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Experience real technical coding assessments simulating LeetCode and Cursor. Solve complex algorithms with an integrated AI mentor operating under a strict token budget to measure your true problem-solving efficiency.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? '/interview/setup' : '/login'}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-glow-purple transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/problems"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-sm transition-all border border-slate-700/80 flex items-center justify-center space-x-2"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Browse 12+ Problems</span>
          </Link>
        </div>

        {/* Key Features Badges */}
        <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Monaco Editor + Multi-Language</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Enforced AI Token Budgeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span>10-Category Structured Score</span>
          </div>
        </div>
      </section>

      {/* Interactive Mock Workspace Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl glass-panel-elevated p-2 shadow-2xl border border-slate-700/60 overflow-hidden">
          {/* Top fake bar */}
          <div className="h-9 bg-dark-900 rounded-t-xl px-4 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-slate-400 ml-2 font-sans font-bold">CodeArena Live Workspace Preview</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-purple-400 font-semibold">1,250 / 2,000 Tokens (37.5%)</span>
              <span>45:00</span>
            </div>
          </div>

          {/* 3 panels preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 h-80 text-xs font-mono bg-dark-950">
            {/* Left */}
            <div className="md:col-span-4 p-4 border-r border-slate-800/80 space-y-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Easy
              </span>
              <h4 className="font-bold text-slate-100 font-sans">Two Sum</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
              </p>
              <div className="p-2 rounded bg-dark-900 text-[10px] text-slate-300 border border-slate-800">
                Input: nums = [2,7,11,15], target = 9<br/>
                Output: [0, 1]
              </div>
            </div>

            {/* Center */}
            <div className="md:col-span-5 p-4 border-r border-slate-800/80 space-y-2 bg-[#090d16] text-[11px] leading-relaxed">
              <span className="text-purple-400 font-bold">function</span> <span className="text-blue-300">twoSum</span>(nums, target) &#123;<br/>
              &nbsp;&nbsp;<span className="text-slate-500">// O(N) Hash Map Lookup</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> Map();<br/>
              &nbsp;&nbsp;<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; nums.length; i++) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">const</span> diff = target - nums[i];<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (map.has(diff)) <span className="text-purple-400">return</span> [map.get(diff), i];<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;map.set(nums[i], i);<br/>
              &nbsp;&nbsp;&#125;<br/>
              &#125;
            </div>

            {/* Right */}
            <div className="md:col-span-3 p-4 space-y-2 bg-dark-900/60 overflow-hidden">
              <div className="flex items-center space-x-1 text-purple-400 font-bold">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI Technical Mentor</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 text-[10px] text-slate-300 space-y-1 font-sans">
                <p className="text-purple-300 font-semibold">Strict Interview Mode:</p>
                <p>Excellent algorithmic choice using an auxiliary map! What is your worst-case space complexity?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed for Elite Engineering Preparation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to calibrate your coding performance under real interview pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict AI Token Accounting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every request is tracked against your initial budget. Warning thresholds fire at 75% and 90%, with assistance disabled at 100% to test your independent problem-solving resilience.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Language Sandbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monaco Editor featuring syntax highlighting, auto-indentation, and native sub-second execution for JavaScript, Python, Java, and C++ with automated test validation.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">10-Category Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive instant objective scoring across problem understanding, asymptotic complexity, code modularity, edge case handling, and AI dependency analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs font-mono text-slate-500">
        CodeArena AI • Private AI-Assisted Coding Interview Platform • Fully Encapsulated
      </footer>

    </div>
  );
};

