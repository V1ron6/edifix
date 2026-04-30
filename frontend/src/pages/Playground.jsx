import { useState, useEffect, useRef } from 'react';
import { playgroundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, Badge } from '../components/ui';
import Input from '../components/ui/Input';
import { Play, Save, Plus, Trash2, Globe, Lock, Copy, Code, Terminal, FolderOpen, Maximize2, Minimize2, RotateCcw, Download, Share2, Sparkles, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'html', label: 'HTML', color: '#e34c26', icon: '📝' },
  { value: 'css', label: 'CSS', color: '#264de4', icon: '🎨' },
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e', icon: '⚡' },
  { value: 'nodejs', label: 'Node.js', color: '#68a063', icon: '💚' },
];

const STARTER_CODE = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
</body>
</html>`,
  css: `/* Your CSS styles */
body {
  font-family: system-ui, sans-serif;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #b8b8d1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: #5b5f97;
}`,
  javascript: `// JavaScript Playground
const greeting = "Hello, World!";
console.log(greeting);

// Try some code
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`,
  nodejs: `// Node.js Playground
const os = require('os');

console.log('Platform:', os.platform());
console.log('CPU Cores:', os.cpus().length);
console.log('Memory:', Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB');

// Your code here...`,
};

export default function Playground() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data } = await playgroundAPI.getAll();
      setSessions(data.data || []);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('');
    try {
      const { data } = await playgroundAPI.run({ language, code });
      setOutput(data.data?.output || 'No output');
    } catch (err) {
      setOutput(err.response?.data?.message || 'Execution error');
    } finally {
      setRunning(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save');
      return;
    }
    setSaving(true);
    try {
      if (activeSession) {
        await playgroundAPI.update(activeSession.id, {
          title: title || 'Untitled',
          language,
          jsCode: language === 'javascript' || language === 'nodejs' ? code : '',
          htmlCode: language === 'html' ? code : '',
          cssCode: language === 'css' ? code : '',
        });
        toast.success('Session updated');
      } else {
        const { data } = await playgroundAPI.create({
          title: title || 'Untitled',
          language,
          jsCode: language === 'javascript' || language === 'nodejs' ? code : '',
          htmlCode: language === 'html' ? code : '',
          cssCode: language === 'css' ? code : '',
          isPublic: false,
        });
        setActiveSession(data.data);
        toast.success('Session saved');
      }
      fetchSessions();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    setActiveSession(null);
    setCode(STARTER_CODE[language] || '');
    setTitle('');
    setOutput('');
  };

  const handleLoad = (session) => {
    setActiveSession(session);
    setTitle(session.title);
    setLanguage(session.language);
    setCode(session.jsCode || session.htmlCode || session.cssCode || '');
    setOutput('');
  };

  const handleDelete = async (id) => {
    try {
      await playgroundAPI.delete(id);
      toast.success('Session deleted');
      if (activeSession?.id === id) handleNew();
      fetchSessions();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!activeSession && !code.trim()) {
      setCode(STARTER_CODE[newLang] || '');
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (loading) return <LoadingScreen main="Loading playground" secondary="Preparing environment" />;

  const currentLang = LANGUAGES.find((l) => l.value === language);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#16213e] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,204,113,0.1)_0%,transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#2ecc71]/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Terminal size={16} className="text-[#2ecc71]" />
              <span className="text-xs font-medium text-[#2ecc71]">Interactive</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Code Playground</h1>
            <p className="mt-2 text-[#a0a0b8]">Write, run, and test code directly in your browser</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" icon={Plus} onClick={handleNew}>
              New Session
            </Button>
          </div>
        </div>

        {/* Quick tips */}
        <div className="relative mt-6 flex flex-wrap gap-4 text-xs text-[#5b5f97]">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded bg-[#2a2a4a] px-1.5 py-0.5 font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="rounded bg-[#2a2a4a] px-1.5 py-0.5 font-mono">Enter</kbd>
            <span>to run</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded bg-[#2a2a4a] px-1.5 py-0.5 font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="rounded bg-[#2a2a4a] px-1.5 py-0.5 font-mono">S</kbd>
            <span>to save</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Editor Area */}
        <div className="space-y-4">
          {/* Title + Language selector */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Session title (e.g., 'Array Methods Practice')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              wrapperClass="flex-1"
              icon={Code}
            />
            <div className="flex gap-1 rounded-xl bg-[#1a1a2e] p-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => handleLanguageChange(l.value)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    language === l.value
                      ? 'bg-[#2a2a4a] text-white shadow-sm'
                      : 'text-[#a0a0b8] hover:text-[#b8b8d1] hover:bg-[#2a2a4a]/50'
                  }`}
                >
                  <span 
                    className="flex h-5 w-5 items-center justify-center rounded text-sm"
                    style={{ backgroundColor: `${l.color}20` }}
                  >
                    {l.icon}
                  </span>
                  <span className="hidden sm:inline">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <div className="relative group">
            <div className="absolute left-0 top-0 flex items-center gap-2 rounded-tl-xl rounded-br-lg bg-[#2a2a4a] px-3 py-1.5 text-xs">
              <span 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentLang?.color }}
              />
              <span className="text-[#a0a0b8]">{currentLang?.label}</span>
              {activeSession && (
                <>
                  <span className="text-[#3a3a5a]">|</span>
                  <span className="text-[#5b5f97]">{activeSession.title}</span>
                </>
              )}
            </div>
            
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`// Write your ${currentLang?.label || ''} code here...`}
              className={`w-full resize-y rounded-xl border border-[#2a2a4a] bg-[#0d1117] p-4 pt-12 font-mono text-sm leading-relaxed text-[#e0e0e0] placeholder-[#5b5f97]/40 outline-none transition-all focus:border-[#5b5f97] focus:shadow-[0_0_0_3px_rgba(91,95,151,0.1)] ${
                isFullscreen ? 'fixed inset-4 z-50 h-auto' : 'h-80'
              }`}
              spellCheck={false}
            />
            
            {/* Editor toolbar */}
            <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopyCode}
                className="rounded-lg bg-[#2a2a4a] p-2 text-[#a0a0b8] transition hover:bg-[#5b5f97]/20 hover:text-[#b8b8d1]"
                title="Copy code"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleClear}
                className="rounded-lg bg-[#2a2a4a] p-2 text-[#a0a0b8] transition hover:bg-[#e74c3c]/20 hover:text-[#e74c3c]"
                title="Clear"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-lg bg-[#2a2a4a] p-2 text-[#a0a0b8] transition hover:bg-[#5b5f97]/20 hover:text-[#b8b8d1]"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
            
            {/* Line count indicator */}
            <div className="absolute bottom-3 left-3 text-xs text-[#5b5f97]">
              {code.split('\n').length} lines
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="success"
              icon={Play}
              onClick={handleRun}
              loading={running}
              disabled={!code.trim()}
              size="lg"
              className="shadow-[0_4px_15px_rgba(46,204,113,0.3)]"
            >
              {running ? 'Running...' : 'Run Code'}
            </Button>
            <Button icon={Save} onClick={handleSave} loading={saving} size="lg">
              {saving ? 'Saving...' : activeSession ? 'Update' : 'Save'}
            </Button>
            {activeSession && (
              <Button variant="secondary" icon={Plus} onClick={handleNew}>
                New
              </Button>
            )}
          </div>

          {/* Output */}
          <div className="overflow-hidden rounded-xl border border-[#2a2a4a] bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-[#2a2a4a] bg-[#1a1a2e] px-4 py-2">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#2ecc71]" />
                <span className="text-xs font-semibold text-[#b8b8d1]">Output</span>
              </div>
              {output && (
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="rounded p-1 text-[#5b5f97] transition hover:bg-[#2a2a4a] hover:text-[#b8b8d1]"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
            <pre className={`max-h-64 overflow-auto p-4 font-mono text-sm ${
              output ? 'text-[#e0e0e0]' : 'text-[#5b5f97]'
            }`}>
              {output || 'Output will appear here after running your code...'}
            </pre>
          </div>
        </div>

        {/* Saved Sessions Sidebar */}
        <div className="space-y-4">
          {user ? (
            <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#2a2a4a] bg-[#1a1a2e] px-4 py-3">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-[#5b5f97]" />
                  <h3 className="text-sm font-semibold text-white">My Sessions</h3>
                </div>
                <Badge variant="outline">{sessions.length}</Badge>
              </div>
              
              {sessions.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5b5f97]/10">
                    <Code size={20} className="text-[#5b5f97]" />
                  </div>
                  <p className="text-sm text-[#a0a0b8]">No saved sessions</p>
                  <p className="mt-1 text-xs text-[#5b5f97]">Save your code to access it later</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto p-2">
                  <ul className="space-y-1.5">
                    {sessions.map((s) => {
                      const lang = LANGUAGES.find((l) => l.value === s.language);
                      const isActive = activeSession?.id === s.id;
                      return (
                        <li
                          key={s.id}
                          onClick={() => handleLoad(s)}
                          className={`group flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                            isActive
                              ? 'border-[#5b5f97] bg-[#5b5f97]/15'
                              : 'border-transparent hover:border-[#2a2a4a] hover:bg-[#1a1a2e]'
                          }`}
                        >
                          <div 
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm"
                            style={{ backgroundColor: `${lang?.color || '#5b5f97'}20` }}
                          >
                            {lang?.icon || '📄'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-[#b8b8d1]'}`}>
                              {s.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-[#5b5f97]">
                              <span className="uppercase">{s.language}</span>
                              {s.updatedAt && (
                                <>
                                  <span className="text-[#3a3a5a]">•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(s.updatedAt).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                            className="shrink-0 rounded-lg p-1.5 text-[#a0a0b8] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#e74c3c]/15 hover:text-[#e74c3c]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5b5f97]/10">
                <Lock size={20} className="text-[#5b5f97]" />
              </div>
              <h3 className="text-sm font-semibold text-[#b8b8d1]">Save Your Work</h3>
              <p className="mt-2 text-xs text-[#a0a0b8]">Log in to save and access your code sessions</p>
            </div>
          )}

          {/* Quick Tips Card */}
          <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#f39c12]" />
              <h3 className="text-xs font-semibold text-[#b8b8d1]">Quick Tips</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#a0a0b8]">
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-0.5 shrink-0 text-[#5b5f97]" />
                Use console.log() to debug
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-0.5 shrink-0 text-[#5b5f97]" />
                Test loops and array methods
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-0.5 shrink-0 text-[#5b5f97]" />
                Practice async/await patterns
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
