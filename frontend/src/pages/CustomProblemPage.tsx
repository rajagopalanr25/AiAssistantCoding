import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Difficulty } from '../types';
import {
  PlusCircle,
  Terminal,
  Layers,
  Save,
  CheckCircle2,
  Trash2,
  Code2
} from 'lucide-react';

export const CustomProblemPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraintsText, setConstraintsText] = useState('1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9');
  const [topicsText, setTopicsText] = useState('Arrays, Algorithms');

  // Test cases
  const [testCases, setTestCases] = useState<Array<{ id: number; input: string; expectedOutput: string; isHidden: boolean; description: string }>>([
    { id: 1, input: '{"n": 5}', expectedOutput: '25', isHidden: false, description: 'Sample case 1' },
    { id: 2, input: '{"n": 0}', expectedOutput: '0', isHidden: true, description: 'Edge case 0' }
  ]);

  const [loading, setLoading] = useState(false);

  const handleAddTestCase = () => {
    setTestCases(prev => [
      ...prev,
      {
        id: prev.length + 1,
        input: '{"input": "val"}',
        expectedOutput: '"result"',
        isHidden: false,
        description: `Test Case ${prev.length + 1}`
      }
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || loading) return;

    setLoading(true);

    try {
      const constraints = constraintsText.split('\n').map(s => s.trim()).filter(Boolean);
      const topics = topicsText.split(',').map(s => s.trim()).filter(Boolean);

      const res = await api.createCustomProblem({
        title,
        difficulty,
        description,
        inputFormat,
        outputFormat,
        constraints,
        topics,
        testCases,
        starterCode: {
          javascript: `function solve(input) {\n  // Write custom solution\n}`,
          python: `def solve(input):\n    # Write custom solution\n    pass`,
          java: `class Solution {\n    public void solve() {}\n}`,
          cpp: `class Solution {\npublic:\n    void solve() {}\n};`
        }
      });

      alert('Custom problem created successfully!');
      navigate('/problems');
    } catch (err: any) {
      alert(`Error creating problem: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Problem Authoring Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Design a Custom Interview Problem
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Author unique algorithmic coding challenges, write test cases, and test them with the CodeArena AI assistant.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Find First Missing Positive Integer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Description & Requirements</label>
              <textarea
                required
                rows={5}
                placeholder="Describe problem context, statement, and operational bounds..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Input Format</label>
                <input
                  type="text"
                  placeholder="nums: int[]"
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Output Format</label>
                <input
                  type="text"
                  placeholder="int representing missing value"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Constraints (One per line)</label>
                <textarea
                  rows={3}
                  value={constraintsText}
                  onChange={(e) => setConstraintsText(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Topics (Comma-separated)</label>
                <input
                  type="text"
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase">Automated Test Cases ({testCases.length})</label>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Test Case</span>
              </button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, index) => (
                <div key={index} className="p-3 rounded-xl bg-dark-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Case #{index + 1}</span>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => {
                            const updated = [...testCases];
                            updated[index].isHidden = e.target.checked;
                            setTestCases(updated);
                          }}
                          className="rounded bg-dark-950 border-slate-700 text-purple-600"
                        />
                        <span>Hidden Test</span>
                      </label>

                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(index)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500">JSON Input:</span>
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) => {
                          const updated = [...testCases];
                          updated[index].input = e.target.value;
                          setTestCases(updated);
                        }}
                        className="w-full bg-dark-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500">Expected Output:</span>
                      <input
                        type="text"
                        value={tc.expectedOutput}
                        onChange={(e) => {
                          const updated = [...testCases];
                          updated[index].expectedOutput = e.target.value;
                          setTestCases(updated);
                        }}
                        className="w-full bg-dark-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-300 mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/problems')}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Creating Problem...' : 'Publish to Problems Library'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

