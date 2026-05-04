import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { addRecentLesson } from '../../utils/learningStorage';
import { unwrap } from '../../utils/response';

export default function LessonView() {
  const { courseSlug, lessonSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [code, setCode] = useState('');
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      try {
        const response = await api.get(`/api/lessons/slug/${courseSlug}/${lessonSlug}`, { auth: false });
        const data = unwrap(response);
        const lesson = data?.lesson || data;
        setLessonData(data);
        setCode(lesson?.codeTemplate || '');
        addRecentLesson({
          courseSlug,
          lessonSlug,
          lessonTitle: lesson?.title,
          courseTitle: lesson?.Course?.title || courseSlug,
          viewedAt: new Date().toISOString(),
        });
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [courseSlug, lessonSlug]);

  const lesson = lessonData?.lesson || lessonData;
  const hints = useMemo(() => {
    if (!lesson?.hints) return [];
    return Array.isArray(lesson.hints) ? lesson.hints : [lesson.hints];
  }, [lesson]);

  const markComplete = async () => {
    try {
      const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
      await api.post(`/api/progress/lesson/${lesson.id}`, {
        status: 'completed',
        timeSpentMinutes: minutes,
        code,
      });
      notifySuccess('Lesson marked complete.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading lesson..." />;
  if (!lesson) return <p className="page-main">Lesson not found.</p>;

  return (
    <main className="page-main">
      <section className="card">
        <h1>{lesson.title}</h1>
        <p>{lesson.type}</p>
        {lesson.videoUrl ? (
          <iframe title={lesson.title} src={lesson.videoUrl} className="lesson-video" allowFullScreen />
        ) : null}
      </section>

      <section className="card markdown-body">
        <ReactMarkdown>{lesson.content || ''}</ReactMarkdown>
      </section>

      {lesson.type === 'practice' ? (
        <section className="card">
          <h3>Practice</h3>
          <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button>Run</Button>
          <pre className="expected-output">{lesson.expectedOutput || 'No expected output provided.'}</pre>
        </section>
      ) : null}

      <section className="card">
        <Button variant="secondary" onClick={() => setHintIndex((value) => Math.min(value + 1, hints.length))}>Reveal Hint</Button>
        {hints.slice(0, hintIndex).map((hint, idx) => <p key={idx}>{hint}</p>)}
      </section>

      <Button onClick={markComplete}>Mark as Complete</Button>
    </main>
  );
}
