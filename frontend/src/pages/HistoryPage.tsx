import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  History,
  Trophy,
  Zap,
  Clock,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.getHistory();
        setHistory(res.history);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this interview session and evaluation report? This action cannot be undone.')) {
      try {
        await api.deleteInterview(id);
        setHistory(prev => prev.filter(i => i.id !== id));
      } catch (err: any) {
        alert('Failed to delete interview: ' + err.message);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Audit Trail
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interview History & Replay Records
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Review completed coding assessments, evaluation verdicts, and AI token accounting logs.
            </p>
          </div>

          <Link
            to="/interview/setup"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all"
          >
            Start New Session
          </Link>
        </div>

        {/* Sessions Table */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500">
            Retrieving interview transcript logs...
          </div>
        ) : history.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No completed interviews found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first AI-assisted coding simulation to generate assessment records and scorecards.
            </p>
            <div className="pt-2">
              <Link
                to="/interview/setup"
                className="inline-flex px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Launch First Interview
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-900/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Test Cases</th>
                    <th className="py-3 px-4">AI Tokens</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {item.problemTitle}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-purple-400 font-semibold">
                          {item.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono uppercase text-slate-300">
                        {item.language}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(item.startedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.score !== null ? (
                          <span className="font-mono font-bold text-sm text-purple-300">
                            {item.score}/100
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">In Progress</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.testCasesPassed || '-'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-blue-400">
                        {item.tokensUsed.toLocaleString()} / {item.tokenBudget.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerdictStyle(item.verdict)}`}>
                          {item.verdict}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {item.status === 'completed' ? (
                          <Link
                            to={`/interview/${item.id}/result`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
                            title="View Detailed Evaluation"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Report</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/interview/${item.id}`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                          >
                            <span>Resume</span>
                          </Link>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

