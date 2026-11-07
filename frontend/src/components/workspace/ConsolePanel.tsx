import React, { useState } from 'react';
import { ExecutionResult } from '../../types';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  X,
  AlertCircle,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ConsolePanelProps {
  execution: ExecutionResult | null;
  isRunning: boolean;
  onClose: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ execution, isRunning, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'output'>('tests');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const selectedCase = execution?.results?.find(
    (r) => r.id === (selectedCaseId ?? execution.results[0]?.id)
  );

  return (
    <div className="h-64 border-t border-slate-800 bg-dark-950 flex flex-col shrink-0 select-text">
      {/* Console Toolbar */}
      <div className="h-9 px-3 border-b border-slate-800 bg-dark-900 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Execution Console</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab === 'tests'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Cases ({execution ? `${execution.passedTests}/${execution.totalTests}` : '0'})
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab === 'output'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Logs
            </button>
          </div>
        </div>

        {/* Runtime Metrics & Close Button */}
        <div className="flex items-center space-x-4">
          {execution && (
            <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{execution.runtimeMs}ms</span>
              </span>
              <span className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-blue-400" />
                <span>{execution.memoryKb} KB</span>
              </span>
              <span className={`font-semibold ${execution.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {execution.success ? 'ACCEPTED' : 'WRONG ANSWER / RUNTIME ERROR'}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Minimize Console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-hidden p-3 font-mono text-xs">
        {isRunning ? (
          <div className="h-full flex items-center justify-center space-x-3 text-slate-400">
            <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Executing code in sandboxed runtime...</span>
          </div>
        ) : !execution ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            Click "Run" or press Ctrl+Enter to execute your solution against test cases.
          </div>
        ) : activeTab === 'tests' ? (
          <div className="h-full flex space-x-4 overflow-hidden">
            {/* Left Case Badges List */}
            <div className="w-44 border-r border-slate-800 pr-3 space-y-1.5 overflow-y-auto shrink-0">
              {execution.results.map((r, i) => (
                <button
                  key={r.id || i}
                  onClick={() => setSelectedCaseId(r.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors border ${
                    (selectedCaseId ?? execution.results[0]?.id) === r.id
                      ? 'bg-slate-800 text-slate-100 border-purple-500/40 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">Case {i + 1}</span>
                  {r.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Case Breakdown */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedCase ? (
                <>
                  <div className="flex items-center justify-between text-xs font-sans pb-1 border-b border-slate-800/60">
                    <span className="font-semibold text-slate-300">
                      {selectedCase.description || `Test Case #${selectedCase.id}`}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedCase.passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                    }`}>
                      {selectedCase.passed ? 'PASSED' : 'FAILED'} ({selectedCase.executionTimeMs}ms)
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-slate-500 font-semibold">Input:</span>
                    <pre className="p-2 rounded bg-dark-900 text-slate-200 border border-slate-800 overflow-x-auto text-[11px]">
                      {selectedCase.input}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold">Expected Output:</span>
                      <pre className="p-2 rounded bg-dark-900 text-emerald-300 border border-slate-800 overflow-x-auto text-[11px] mt-0.5">
                        {selectedCase.expectedOutput}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold">Actual Output:</span>
                      <pre className={`p-2 rounded bg-dark-900 border overflow-x-auto text-[11px] mt-0.5 ${
                        selectedCase.passed ? 'text-emerald-300 border-slate-800' : 'text-rose-400 border-rose-500/30'
                      }`}>
                        {selectedCase.actualOutput || (selectedCase.error ? 'Error encountered' : 'undefined')}
                      </pre>
                    </div>
                  </div>

                  {selectedCase.error && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] mt-2">
                      <span className="font-bold text-rose-200">Error: </span>
                      {selectedCase.error}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto bg-dark-900/90 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
            {execution.compileOutput || 'No stdout/stderr logs recorded during this execution.'}
          </div>
        )}
      </div>
    </div>
  );
};

