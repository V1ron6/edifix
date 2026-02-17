import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, ProgressBar, EmptyState } from '../components/ui';
import { BookOpen, Clock, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courseRes } = await courseAPI.getBySlug(slug);
        setCourse(courseRes.data);
        if (user) {
          try {
            const { data: progRes } = await progressAPI.getByCourse(courseRes.data.id);
            setCourseProgress(progRes.data);
          } catch { /* no progress yet */ }
        }
      } catch {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, user]);

  if (loading) return <LoadingScreen main="Loading course" secondary={`Fetching ${slug}`} />;
  if (!course) return <EmptyState icon={BookOpen} title="Course not found" description="This course may have been removed." />;

  const completedLessons = courseProgress?.completedLessons || [];
  const totalLessons = course.lessons?.length || 0;
  const completedCount = completedLessons.length;

  return (
    <div className="space-y-6">
      <Link to="/courses" className="flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]">
        <ArrowLeft size={14} /> Back to courses
      </Link>

      {/* Course Header */}
      <Card highlight>
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="default">{course.category}</Badge>
          <Badge color={
            course.difficulty === 'beginner' ? '#2ecc71' :
            course.difficulty === 'intermediate' ? '#f39c12' : '#e74c3c'
          } dot>
            {course.difficulty}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">{course.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#a0a0b8]">{course.description}</p>
        <div className="mt-4 flex items-center gap-6 text-xs text-[#5b5f97]">
          <span className="flex items-center gap-1">
            <BookOpen size={14} /> {totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {course.estimatedHours}h estimated
          </span>
          {user && (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} />
              {completedCount}/{totalLessons} completed
            </span>
          )}
        </div>

        {/* Progress bar for logged-in users */}
        {user && totalLessons > 0 && (
          <ProgressBar
            value={completedCount}
            max={totalLessons}
            size="sm"
            color={completedCount === totalLessons ? '#2ecc71' : '#5b5f97'}
            className="mt-4"
          />
        )}
      </Card>

      {/* Lessons list */}
      <div className="space-y-2">
        <h2 className="font-semibold text-[#b8b8d1]">Lessons</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => {
              const isCompleted = completedLessons.some((l) => l.lessonId === lesson.id || l === lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to={`/courses/${slug}/${lesson.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-200 hover:border-[#5b5f97]/50 hover:shadow-[0_2px_12px_rgba(91,95,151,0.06)]"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isCompleted
                      ? 'bg-[#2ecc71]/15 text-[#2ecc71]'
                      : 'bg-[#1a1a2e] text-[#5b5f97]'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#b8b8d1] group-hover:text-white">{lesson.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#5b5f97]">
                      <Badge variant="outline" className="text-[10px]">{lesson.type}</Badge>
                      {lesson.estimatedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {lesson.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                  {isCompleted ? (
                    <Badge variant="success">Done</Badge>
                  ) : (
                    <Circle size={18} className="text-[#2a2a4a] transition-colors group-hover:text-[#5b5f97]" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="No lessons yet" description="Lessons will appear here once added." />
        )}
      </div>
    </div>
  );
}
