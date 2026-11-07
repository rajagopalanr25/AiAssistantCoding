import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  ShieldCheck,
  KeyRound,
  Server,
  Lock,
  Sun,
  Moon,
  Info,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            System & Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Application Settings & Environment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review your private deployment parameters, security status, and sandboxed execution services.
          </p>
        </div>

        {/* Security & Private Isolation Banner */}
        <div className="glass-panel rounded-2xl p-6 border-purple-500/30 space-y-3">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Private Deployment & Data Isolation Guarantee
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CodeArena AI operates as a private, self-contained assessment suite. All candidate code snapshots, test case traces, token consumption ledgers, and AI evaluations are strictly isolated on the backend. No third-party analytics scripts or external indexing crawlers have access.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-emerald-400">
              ✓ User-Specific Data Isolation Active
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-purple-300">
              ✓ Strict Secret Encapsulation (Backend Only)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-blue-400">
              ✓ Sandboxed Process Isolation
            </span>
          </div>
        </div>

        {/* Configuration Overview */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Service Integration Health</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">AI Provider Engine</span>
              <p className="font-semibold text-slate-200">OpenAI API (GPT-4o / GPT-4o-mini)</p>
              <p className="text-[11px] text-purple-400 font-sans">
                Active. Automatic fallback to high-fidelity deterministic mentorship when offline.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Code Execution Engine</span>
              <p className="font-semibold text-slate-200">Dual Engine: Node & Python + Judge0</p>
              <p className="text-[11px] text-emerald-400 font-sans">
                Native sub-second runner active for JavaScript & Python with memory/time containment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Database Architecture</span>
              <p className="font-semibold text-slate-200">Dual-Tier: MongoDB Atlas + Embedded Store</p>
              <p className="text-[11px] text-blue-400 font-sans">
                Zero-friction persistent local JSON database active. Connects to Atlas URI if provided.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Authentication</span>
              <p className="font-semibold text-slate-200">JWT + Bcrypt Password Hashing</p>
              <p className="text-[11px] text-slate-400 font-sans">
                HTTP Authorization Bearer headers with cryptographic signatures.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Appearance & Interface Theme
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Current Mode: {theme.toUpperCase()}</p>
              <p className="text-xs text-slate-400">Toggle between developer dark theme and light theme.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

