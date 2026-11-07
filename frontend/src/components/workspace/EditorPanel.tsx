import React, { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Language } from '../../types';
import {
  Play,
  Send,
  RotateCcw,
  Sparkles,
  Terminal,
  Settings2,
  Check,
  Code2,
  Sliders
} from 'lucide-react';

interface EditorPanelProps {
  code: string;
  onChange: (value: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRunCode: () => void;
  onSubmit: () => void;
  onResetCode: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  toggleConsole: () => void;
  isConsoleOpen: boolean;
  autoSaveStatus: 'saved' | 'saving';
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onRunCode,
  onSubmit,
  onResetCode,
  isRunning,
  isSubmitting,
  toggleConsole,
  isConsoleOpen,
  autoSaveStatus,
}) => {
  const editorRef = useRef<any>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom dark theme configuration
    monaco.editor.defineTheme('codearenaDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'string', foreground: '6ee7b7' },
        { token: 'number', foreground: '38bdf8' },
        { token: 'type', foreground: '818cf8' },
      ],
      colors: {
        'editor.background': '#090d16',
        'editor.foreground': '#e2e8f0',
        'editorCursor.foreground': '#a855f7',
        'editor.lineHighlightBackground': '#11182740',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#c084fc',
        'editorIndentGuide.background': '#1e293b40',
        'editorIndentGuide.activeBackground': '#334155',
        'editor.selectionBackground': '#8b5cf630',
      },
    });

    monaco.editor.setTheme('codearenaDark');

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const getMonacoLanguage = (lang: Language): string => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-950 overflow-hidden relative">
      {/* Editor Top Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-dark-900/90 px-3 flex items-center justify-between shrink-0 select-none">
        {/* Left: Language Selector & Auto-save Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-dark-950 border border-slate-800 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3.10</option>
              <option value="java">Java (OpenJDK)</option>
              <option value="cpp">C++ (GCC)</option>
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center space-x-1">
            <span className={`w-1.5 h-1.5 rounded-full ${autoSaveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            <span>{autoSaveStatus === 'saved' ? 'Saved' : 'Saving...'}</span>
          </div>
        </div>

        {/* Right: Controls & Run/Submit Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors text-xs flex items-center space-x-1"
            title="Format Code (Alt+Shift+F)"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Format</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs flex items-center space-x-1"
            title="Reset to Starter Stub"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Font Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Editor Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {showSettings && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-elevated p-3 z-30 shadow-2xl space-y-2"
                onMouseLeave={() => setShowSettings(false)}
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">Font Size ({fontSize}px)</span>
                <div className="flex space-x-1">
                  {[12, 14, 16, 18].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-1 text-xs font-mono rounded ${
                        fontSize === size ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle Console */}
          <button
            onClick={toggleConsole}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center space-x-1.5 border transition-colors ${
              isConsoleOpen
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            title="Run Code (Ctrl + Enter)"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
            <span className="hidden lg:inline text-[10px] text-slate-400 ml-1 font-mono font-normal">^↵</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all hover:scale-[1.02] disabled:opacity-50"
            title="Submit Final Solution (Ctrl + Shift + Enter)"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 w-full h-full min-h-0">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorMount}
          theme="codearenaDark"
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
            fontLigatures: true,
            tabSize: 2,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};

