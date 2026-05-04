import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function Playground() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('console.log("Hello Edifix");');
  const [output, setOutput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const payload = useMemo(() => {
    if (language === 'html') return { htmlCode: code, cssCode: '', jsCode: '', language: 'html' };
    if (language === 'css') return { htmlCode: '', cssCode: code, jsCode: '', language: 'css' };
    return { htmlCode: '', cssCode: '', jsCode: code, language: 'javascript' };
  }, [code, language]);

  const loadSessions = async () => {
    try {
      const response = await api.get('/api/playground');
      setSessions(unwrap(response)?.sessions || []);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const run = async () => {
    try {
      const response = await api.post('/api/playground/run', { language, code });
      setOutput(unwrap(response)?.output || 'Code executed.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const save = async () => {
    try {
      await api.post('/api/playground', { ...payload, title: `Snippet ${new Date().toISOString()}` });
      notifySuccess('Snippet saved.');
      loadSessions();
    } catch (error) {
      notifyError(error.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading playground..." />;

  return (
    <main className="page-main">
      <section className="playground-grid">
        <article className="card">
          <div className="row-actions">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
            </select>
            <Button onClick={run}>Run</Button>
            <Button variant="secondary" onClick={save}>Save</Button>
          </div>
          <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} />
        </article>
        <article className="card">
          <h3>Preview / Output</h3>
          <pre className="expected-output">{output || 'Run code to see output.'}</pre>
        </article>
      </section>
      <section className="card">
        <h3>Saved snippets</h3>
        <div className="stack-list">
          {sessions.map((session) => (
            <button key={session.id} className="card" onClick={() => setCode(session.jsCode || session.htmlCode || session.cssCode || '')}>
              {session.title} ({session.language})
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
