import { useState, useEffect } from 'react';
import { playgroundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Button, EmptyState, Badge } from '../components/ui';
import Input from '../components/ui/Input';
import { Play, Save, Plus, Trash2, Globe, Lock, Copy, Code, Terminal, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'html', label: 'HTML', color: '#e34c26' },
  { value: 'css', label: 'CSS', color: '#264de4' },
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'nodejs', label: 'Node.js', color: '#68a063' },
];

export default function Playground() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setCode('');
    setTitle('');
    setOutput('');
    setLanguage('javascript');
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

  if (loading) return <LoadingScreen main="Loading playground" secondary="Preparing environment" />;

  const currentLang = LANGUAGES.find((l) => l.value === language);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Code Playground"
        description="Write, run, and test code in the browser"
        actions={
          <Button variant="secondary" icon={Plus} onClick={handleNew}>
            New Session
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Editor Area */}
        <div className="space-y-3">
          {/* Title + Language selector */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Session title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              wrapperClass="flex-1"
              icon={Code}
            />
            <div className="flex gap-1 rounded-lg bg-[#1a1a2e] p-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLanguage(l.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    language === l.value
                      ? 'bg-[#2a2a4a] text-[#b8b8d1] shadow-sm'
                      : 'text-[#a0a0b8] hover:text-[#b8b8d1]'
                  }`}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write your ${currentLang?.label || ''} code here...`}
              className="h-72 w-full resize-y rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 font-mono text-sm leading-relaxed text-[#e0e0e0] placeholder-[#5b5f97]/40 outline-none transition focus:border-[#5b5f97] focus:shadow-[0_0_0_3px_rgba(91,95,151,0.1)]"
              spellCheck={false}
            />
            {code && (
              <button
                onClick={handleCopyCode}
                className="absolute right-3 top-3 rounded-md bg-[#2a2a4a] p-1.5 text-[#a0a0b8] transition hover:bg-[#5b5f97]/20 hover:text-[#b8b8d1]"
                title="Copy code"
              >
                <Copy size={14} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="success"
              icon={Play}
              onClick={handleRun}
              loading={running}
              disabled={!code.trim()}
            >
              {running ? 'Running...' : 'Run'}
            </Button>
            <Button icon={Save} onClick={handleSave} loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>

          {/* Output */}
          {output && (
            <Card padding="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Terminal size={14} className="text-[#5b5f97]" />
                <span className="text-xs font-semibold text-[#5b5f97]">Output</span>
              </div>
              <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-[#1a1a2e] p-3 font-mono text-sm text-[#e0e0e0]">
                {output}
              </pre>
            </Card>
          )}
        </div>

        {/* Saved Sessions Sidebar */}
        {user && (
          <Card padding="p-4">
            <div className="mb-3 flex items-center gap-2">
              <FolderOpen size={14} className="text-[#5b5f97]" />
              <h3 className="text-sm font-semibold text-[#b8b8d1]">Saved Sessions</h3>
            </div>
            {sessions.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#a0a0b8]">No saved sessions yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {sessions.map((s) => {
                  const lang = LANGUAGES.find((l) => l.value === s.language);
                  return (
                    <li
                      key={s.id}
                      className={`group flex items-center justify-between rounded-lg border p-2.5 text-xs transition-all cursor-pointer ${
                        activeSession?.id === s.id
                          ? 'border-[#5b5f97] bg-[#5b5f97]/10'
                          : 'border-[#2a2a4a] hover:border-[#5b5f97]/30 hover:bg-[#5b5f97]/5'
                      }`}
                      onClick={() => handleLoad(s)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#b8b8d1] truncate">{s.title}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang?.color || '#5b5f97' }} />
                          <span className="uppercase text-[#5b5f97]">{s.language}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                        className="shrink-0 rounded-md p-1 text-[#a0a0b8] opacity-0 transition group-hover:opacity-100 hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
