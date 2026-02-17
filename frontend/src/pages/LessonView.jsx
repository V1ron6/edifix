import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, Badge } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Play, BookOpen, Copy, Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LessonView() {
  const { courseSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data } = await lessonAPI.getBySlug(courseSlug, lessonSlug);
        setLesson(data.data);
      } catch {
        toast.error('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseSlug, lessonSlug]);

  const handleComplete = async () => {
    if (!user) {
      toast.error('Please log in to track progress');
      return;
    }
    setCompleting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 60000);
      await progressAPI.updateLesson(lesson.id, {
        status: 'completed',
        timeSpentMinutes: Math.max(timeSpent, 1),
      });
      setCompleted(true);
      toast.success('Lesson completed!');
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setCompleting(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  if (loading) return <LoadingScreen main="Loading lesson" secondary={lessonSlug?.replace(/-/g, ' ')} />;
  if (!lesson) return <p className="py-12 text-center text-[#a0a0b8]">Lesson not found.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to={`/courses/${courseSlug}`}
          className="flex items-center gap-1 text-[#5b5f97] transition hover:text-[#b8b8d1]"
        >
          <ArrowLeft size={14} /> Back to course
        </Link>
      </div>

      {/* Header */}
      <Card padding="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">{lesson.type || 'lesson'}</Badge>
          {lesson.estimatedMinutes && (
            <Badge variant="outline" icon={Clock}>
              {lesson.estimatedMinutes} min
            </Badge>
          )}
          {completed && (
            <Badge variant="success" icon={CheckCircle2}>Completed</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">{lesson.title}</h1>
      </Card>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="aspect-video overflow-hidden rounded-xl border border-[#2a2a4a] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <Card padding="p-6 sm:p-8">
        <div className="prose prose-invert max-w-none text-[#e0e0e0] prose-headings:text-[#b8b8d1] prose-a:text-[#5b5f97] prose-code:text-[#b8b8d1] prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-[#2a2a4a] prose-pre:rounded-xl prose-strong:text-[#b8b8d1] prose-li:text-[#e0e0e0]">
          <ReactMarkdown>{lesson.content || 'No content available.'}</ReactMarkdown>
        </div>
      </Card>

      {/* Code Template */}
      {lesson.codeTemplate && (
        <Card padding="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <Play size={14} className="text-[#2ecc71]" /> Practice Code
            </h3>
            <button
              onClick={() => handleCopyCode(lesson.codeTemplate)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[#a0a0b8] transition hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 font-mono text-sm leading-relaxed text-[#e0e0e0]">
            <code>{lesson.codeTemplate}</code>
          </pre>
          {lesson.expectedOutput && (
            <div className="mt-3 rounded-lg bg-[#2ecc71]/5 border border-[#2ecc71]/20 p-3">
              <p className="text-xs text-[#a0a0b8]">
                Expected output: <code className="ml-1 rounded bg-[#1a1a2e] px-1.5 py-0.5 font-mono text-[#2ecc71]">{lesson.expectedOutput}</code>
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Hints */}
      {lesson.hints && lesson.hints.length > 0 && (
        <Card padding="p-5">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex w-full items-center justify-between"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <Lightbulb size={14} className="text-[#f39c12]" />
              Hints ({lesson.hints.length})
            </h3>
            <Badge variant="outline" className="text-[10px]">
              {showHints ? 'Hide' : 'Show'}
            </Badge>
          </button>
          {showHints && (
            <ul className="mt-3 space-y-2 border-t border-[#2a2a4a] pt-3">
              {lesson.hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#a0a0b8]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#f39c12]/10 text-[10px] font-bold text-[#f39c12]">
                    {i + 1}
                  </span>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Complete button */}
      {user && (
        <div className="flex justify-end">
          <Button
            onClick={handleComplete}
            loading={completing}
            disabled={completed}
            icon={CheckCircle2}
            variant={completed ? 'success' : 'primary'}
            size="lg"
          >
            {completed ? 'Completed' : completing ? 'Saving...' : 'Mark as Complete'}
          </Button>
        </div>
      )}
    </div>
  );
}
