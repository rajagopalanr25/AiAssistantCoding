import React, { useState } from 'react';
import { api } from '../services/api';
import {
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  Database,
  Code2,
  BrainCircuit,
  MessageSquare,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const ResumePrepPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sampleResume = `Senior Full Stack Software Engineer with 5 years experience designing distributed web services.
- Architected high-throughput microservices in Node.js and TypeScript handling 50k requests/min.
- Optimized PostgreSQL queries by introducing composite B-Tree indexes, reducing P99 latency by 45%.
- Implemented Redis cache-aside invalidation patterns for session management and rate limiting.
- Designed reusable frontend component architecture with React and Tailwind CSS.
- Tech Stack: Node.js, TypeScript, React, Python, PostgreSQL, Redis, Docker, AWS.`;

  const handleGenerate = async () => {
    if (!resumeText.trim() || loading) return;
    setLoading(true);

    try {
      const res = await api.generateResumePrep(resumeText);
      setAnalysis(res.analysis);
    } catch (err: any) {
      alert(`Resume analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            AI Interview Prep
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume-Based Technical Interview Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Paste your resume, experience points, or tech stack. The AI will extract your core technologies and generate custom engineering interview questions.
          </p>
        </div>

        {/* Input Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Paste Resume or Project Summary</span>
            </label>

            <button
              onClick={() => setResumeText(sampleResume)}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 underline"
            >
              Fill Sample Experience
            </button>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={7}
            placeholder="Paste your resume work history, technical accomplishments, or architecture projects here..."
            className="w-full bg-dark-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              {resumeText.length} characters • Stored privately in local session
            </span>

            <div className="flex space-x-3">
              {resumeText && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !resumeText.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-purple transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Synthesizing Custom Questions...' : 'Generate Interview Questions'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Questions Output */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
            
            {/* Candidate Summary */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
              <span className="font-bold text-purple-100 uppercase tracking-wide block mb-1">Detected Profile Competency:</span>
              <p>{analysis.summary}</p>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Technical Questions */}
              <div className="glass-panel rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Technical & Distributed Systems Questions</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {analysis.technicalQuestions?.map((q: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-dark-950 border border-slate-800/80">
                      <span className="font-mono text-purple-400 font-bold">Q{i + 1}.</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Architecture */}
              <div className="glass-panel rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Project Architecture & Deep Dives</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {analysis.projectArchitectureQuestions?.map((q: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-dark-950 border border-slate-800/80">
                      <span className="font-mono text-blue-400 font-bold">Q{i + 1}.</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* OOP & Design */}
              <div className="glass-panel rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <Code2 className="w-4 h-4" />
                  <span>OOP & Low-Level Design</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {analysis.oopAndDesignQuestions?.map((q: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-dark-950 border border-slate-800/80">
                      <span className="font-mono text-emerald-400 font-bold">Q{i + 1}.</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Database & DBMS */}
              <div className="glass-panel rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Database & Data Modeling Questions</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {analysis.databaseAndSystemQuestions?.map((q: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-dark-950 border border-slate-800/80">
                      <span className="font-mono text-amber-400 font-bold">Q{i + 1}.</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

