"use client"
import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { langs } from '@uiw/codemirror-extensions-langs';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { toast } from 'react-hot-toast';
import styles from './CodeEditor.module.css';
import { executeCode } from '@/services/codeExecution';

const languages = {
  javascript: { 
    setup: langs.javascript({ jsx: true }), 
    name: 'JavaScript',
    extension: 'js',
    jdoodleId: 'nodejs'
  },
  python: { 
    setup: langs.python(), 
    name: 'Python',
    extension: 'py',
    jdoodleId: 'python3'
  },
  cpp: { 
    setup: langs.cpp(), 
    name: 'C++',
    extension: 'cpp',
    jdoodleId: 'cpp17'
  },
  java: { 
    setup: langs.java(), 
    name: 'Java',
    extension: 'java',
    jdoodleId: 'java'
  },
} as const;

type Language = keyof typeof languages;

const defaultCode: Record<Language, string> = {
  javascript: '// Write your JavaScript code here\n\nconsole.log("Hello, World!");\n',
  python: '# Write your Python code here\n\nprint("Hello, World!")\n',
  cpp: '// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
  java: '// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n'
};

// Load saved code from localStorage
const loadSavedState = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem('codeEditorState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the saved state
      if (parsed.savedCodes && typeof parsed.savedCodes === 'object') {
        // Validate each language's code
        const validCodes: Record<string, string> = {};
        Object.entries(parsed.savedCodes).forEach(([lang, code]) => {
          if (lang in languages && typeof code === 'string') {
            validCodes[lang] = code;
          }
        });
        return {
          language: parsed.language in languages ? parsed.language : 'javascript',
          savedCodes: validCodes
        };
      }
    }
  } catch (error) {
    console.error('Failed to load saved state:', error);
  }
  return null;
};

export const CodeEditor: React.FC = () => {
  // Initialize state with saved values or defaults
  const savedState = loadSavedState();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (savedState?.language as Language) || 'javascript'
  );
  const [code, setCode] = useState(
    savedState?.savedCodes?.[selectedLanguage] || defaultCode[selectedLanguage]
  );
  const [outputs, setOutputs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [savedCodes, setSavedCodes] = useState<Record<string, string>>(
    savedState?.savedCodes || {}
  );

  // Save state to localStorage whenever code or savedCodes changes
  useEffect(() => {
    localStorage.setItem('codeEditorState', JSON.stringify({
      language: selectedLanguage,
      savedCodes: {
        ...savedCodes,
        [selectedLanguage]: code
      }
    }));
  }, [code, selectedLanguage, savedCodes]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    setSavedCodes(prev => ({
      ...prev,
      [selectedLanguage]: value
    }));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value as Language;
    setSelectedLanguage(newLang);
    
    // Load saved code for this language or use default
    setCode(savedCodes[newLang] || defaultCode[newLang]);
    setOutputs([]);
  };

  const handleResetCurrentLanguage = () => {
    // Reset current language to default
    setCode(defaultCode[selectedLanguage]);
    
    // Remove current language from saved codes
    setSavedCodes(prev => {
      const newSavedCodes = { ...prev };
      delete newSavedCodes[selectedLanguage];
      return newSavedCodes;
    });
    
    setOutputs([]);
    toast.success('Reset code to default');
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    
    try {
      const result = await executeCode({
        script: code,
        language: languages[selectedLanguage].jdoodleId,
        versionIndex: "0"
      });
      
      setOutputs(prev => [
        ...prev,
        `>>> ${languages[selectedLanguage].name} ran ${code.split('\n').length} lines of code:\n${result.output.trim()}\n`
      ]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute code');
      setOutputs(prev => [...prev, 'Error: Failed to execute code. Please try again.\n']);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClearOutput = () => {
    setOutputs([]);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-[#1e1e1e] text-white flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[#2d2d2d] bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-[#2d2d2d] text-white px-3 h-9 rounded-md border border-[#3d3d3d] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium transition-all duration-200 hover:border-emerald-400 cursor-pointer min-w-[140px] appearance-none bg-no-repeat bg-right pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '20px' }}
          >
            {Object.entries(languages).map(([key, { name }]) => (
              <option key={key} value={key} className="bg-[#2d2d2d] text-white py-1">
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className={`bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-md text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isExecuting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60} minSize={30} className={styles.panel}>
            <div className={styles.editorContainer}>
              <div className="flex items-center justify-between h-9 px-4 border-b border-[#2d2d2d]">
                <div className="text-sm font-medium text-gray-300">Input</div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleResetCurrentLanguage}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    Reset
                  </button>
                  <div className="text-xs text-gray-500 font-mono">
                    {languages[selectedLanguage].extension}
                  </div>
                </div>
              </div>
              <div className={styles.editorContent}>
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={vscodeDark}
                  extensions={[languages[selectedLanguage].setup]}
                  onChange={handleCodeChange}
                  style={{
                    fontSize: "14px",
                    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <PanelResizeHandle className={styles.resizeHandle} />
          
          <ResizablePanel defaultSize={40} minSize={20} className={styles.panel}>
            <div className={styles.outputContainer}>
              <div className="flex items-center justify-between h-9 px-4 border-b border-[#2d2d2d]">
                <div className="text-sm font-medium text-gray-300">Output</div>
                <button 
                  onClick={handleClearOutput}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
              <div className={styles.outputContent}>
                {outputs.length === 0 && !isExecuting && (
                  <div className="p-4 text-sm text-gray-500">
                    {languages[selectedLanguage].name} environment ready. Hit run to try out some code!
                  </div>
                )}
                {outputs.map((output, index) => (
                  <pre key={index} className="p-4 text-sm font-mono whitespace-pre-wrap text-gray-300 border-b border-[#2d2d2d] last:border-0">{output}</pre>
                ))}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};