import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProblemSummary, Difficulty } from '../types';
import {
  Terminal,
  Search,
  Filter,
  PlusCircle,
  Play,
  Layers,
  ChevronRight,
  Sparkles,
  Tag
} from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await api.getProblems({
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
          topic: selectedTopic !== 'All' ? selectedTopic : undefined,
          search: searchQuery || undefined
        });
        setProblems(res.problems);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, [selectedDifficulty, selectedTopic, searchQuery]);

  const topicsList = ['All', 'Arrays', 'Hash Table', 'Strings', 'Dynamic Programming', 'Linked List', 'Binary Search', 'Stack'];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Expert':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Question Bank
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Standard Interview Problems
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Practice real technical interview questions curated from Tier-1 software engineering loops.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/problems/create"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-2 border border-slate-700/80"
            >
              <PlusCircle className="w-4 h-4 text-purple-400" />
              <span>Create Custom Problem</span>
            </Link>

            <Link
              to="/interview/setup"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Quick Mock Interview</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems by title, keywords, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 font-semibold'
                    : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Topic Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-dark-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500">
            Scanning problem catalogue...
          </div>
        ) : problems.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
            <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching coding problems found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your difficulty and topic filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((prob) => (
              <div
                key={prob.id}
                className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:scale-[1.01] group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getDifficultyBadge(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {prob.testCaseCount} Test Cases
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prob.descriptionSnippet}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  {/* Topic pills */}
                  <div className="flex flex-wrap gap-1">
                    {prob.topics?.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-950 text-slate-400 border border-slate-800"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Launch button */}
                  <button
                    onClick={() => navigate(`/interview/setup?problem=${prob.slug}`)}
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-semibold transition-all group-hover:shadow-glow-purple"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Practice in AI Arena</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

