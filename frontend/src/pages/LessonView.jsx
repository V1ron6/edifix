import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lessonAPI, progressAPI, courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, Badge } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Play, BookOpen, Copy, Lightbulb, ChevronRight, Video, FileText, Code, ExternalLink, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_ICONS = {
  video: Video,
  reading: FileText,
  exercise: Code,
  lesson: BookOpen,
};

export default function LessonView() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [startTime] = useState(Date.now());
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, courseRes] = await Promise.all([
          lessonAPI.getBySlug(courseSlug, lessonSlug),
          courseAPI.getBySlug(courseSlug),
        ]);
        setLesson(lessonRes.data.data);
        setCourse(courseRes.data.data);
      } catch {
        toast.error('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    setCodeCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (loading) return <LoadingScreen main="Loading lesson" secondary={lessonSlug?.replace(/-/g, ' ')} />;
  if (!lesson) return <p className="py-12 text-center text-[#a0a0b8]">Lesson not found.</p>;

  // Find current lesson index and next/prev lessons
  const lessons = course?.lessons || [];
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const LessonIcon = TYPE_ICONS[lesson.type] || BookOpen;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/courses" className="text-[#5b5f97] hover:text-[#b8b8d1] transition">
          Courses
        </Link>
        <ChevronRight size={14} className="text-[#5b5f97]" />
        <Link to={`/courses/${courseSlug}`} className="text-[#5b5f97] hover:text-[#b8b8d1] transition truncate max-w-[150px]">
          {course?.title || courseSlug}
        </Link>
        <ChevronRight size={14} className="text-[#5b5f97]" />
        <span className="text-[#a0a0b8] truncate max-w-[150px]">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize flex items-center gap-1">
              <LessonIcon size={12} />
              {lesson.type || 'lesson'}
            </Badge>
            {lesson.estimatedMinutes && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock size={12} />
                {lesson.estimatedMinutes} min
              </Badge>
            )}
            {completed && (
              <Badge variant="success" icon={CheckCircle2}>Completed</Badge>
            )}
            <span className="text-xs text-[#5b5f97] ml-auto">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{lesson.title}</h1>
        </div>
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <Card padding="p-0" className="overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </Card>
      )}

      {/* Content */}
      <Card padding="p-6 sm:p-8">
        <div className="prose prose-invert prose-lg max-w-none text-[#e0e0e0] prose-headings:text-[#b8b8d1] prose-headings:font-bold prose-a:text-[#5b5f97] prose-code:text-[#b8b8d1] prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-[#2a2a4a] prose-pre:rounded-xl prose-strong:text-[#b8b8d1] prose-li:text-[#e0e0e0] prose-li:marker:text-[#5b5f97]">
          <ReactMarkdown>{lesson.content || 'No content available.'}</ReactMarkdown>
        </div>
      </Card>

      {/* Code Template */}
      {lesson.codeTemplate && (
        <Card padding="p-5" className="border-[#2ecc71]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-[#b8b8d1]">
              <div className="p-1.5 bg-[#2ecc71]/20 rounded-lg">
                <Play size={14} className="text-[#2ecc71]" />
              </div>
              Practice Code
            </h3>
            <div className="flex items-center gap-2">
              <Link to="/playground" className="flex items-center gap-1 text-xs text-[#5b5f97] hover:text-[#b8b8d1] transition">
                <ExternalLink size={12} /> Open in Playground
              </Link>
              <button
                onClick={() => handleCopyCode(lesson.codeTemplate)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#a0a0b8] transition hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                {codeCopied ? <Check size={12} className="text-[#2ecc71]" /> : <Copy size={12} />}
                {codeCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-[#2a2a4a] bg-[#0f0f1a] p-4 font-mono text-sm leading-relaxed text-[#e0e0e0]">
            <code>{lesson.codeTemplate}</code>
          </pre>
          {lesson.expectedOutput && (
            <div className="mt-4 rounded-xl bg-[#2ecc71]/5 border border-[#2ecc71]/20 p-4">
              <p className="text-sm text-[#a0a0b8] flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2ecc71]" />
                Expected output: 
                <code className="rounded bg-[#1a1a2e] px-2 py-1 font-mono text-[#2ecc71]">{lesson.expectedOutput}</code>
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Hints */}
      {lesson.hints && lesson.hints.length > 0 && (
        <Card padding="p-5" className="border-[#f39c12]/20">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex w-full items-center justify-between"
          >
            <h3 className="flex items-center gap-2 font-semibold text-[#b8b8d1]">
              <div className="p-1.5 bg-[#f39c12]/20 rounded-lg">
                <Lightbulb size={14} className="text-[#f39c12]" />
              </div>
              Hints ({lesson.hints.length})
            </h3>
            <Badge variant="outline">
              {showHints ? 'Hide' : 'Show'}
            </Badge>
          </button>
          {showHints && (
            <ul className="mt-4 space-y-3 border-t border-[#2a2a4a] pt-4">
              {lesson.hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#a0a0b8]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f39c12]/10 text-xs font-bold text-[#f39c12]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{hint}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#2a2a4a]">
        {/* Previous */}
        {prevLesson ? (
          <Link to={`/courses/${courseSlug}/${prevLesson.slug}`} className="group">
            <Button variant="ghost" icon={ArrowLeft}>
              <span className="hidden sm:inline">Previous: </span>
              <span className="truncate max-w-[150px]">{prevLesson.title}</span>
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
        
        {/* Complete / Next */}
        <div className="flex items-center gap-3">
          {user && !completed && (
            <Button
              onClick={handleComplete}
              loading={completing}
              disabled={completed}
              icon={CheckCircle2}
              variant={completed ? 'success' : 'primary'}
            >
              {completed ? 'Completed' : completing ? 'Saving...' : 'Mark Complete'}
            </Button>
          )}
          
          {nextLesson ? (
            <Link to={`/courses/${courseSlug}/${nextLesson.slug}`}>
              <Button variant="primary">
                Next Lesson
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          ) : completed ? (
            <Link to={`/courses/${courseSlug}`}>
              <Button variant="success">
                Course Overview
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
