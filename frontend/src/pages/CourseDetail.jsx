import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, ProgressBar, EmptyState, Button } from '../components/ui';
import { BookOpen, Clock, CheckCircle2, Circle, ArrowLeft, Play, Trophy, Target, ChevronRight, Lock, Zap } from 'lucide-react';
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
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isComplete = completedCount === totalLessons && totalLessons > 0;

  // Find next lesson
  const nextLesson = course.lessons?.find((lesson) => 
    !completedLessons.some((l) => l.lessonId === lesson.id || l === lesson.id)
  );

  const difficultyColors = {
    beginner: { bg: 'bg-[#2ecc71]/10', text: 'text-[#2ecc71]', border: 'border-[#2ecc71]/30' },
    intermediate: { bg: 'bg-[#f39c12]/10', text: 'text-[#f39c12]', border: 'border-[#f39c12]/30' },
    advanced: { bg: 'bg-[#e74c3c]/10', text: 'text-[#e74c3c]', border: 'border-[#e74c3c]/30' },
  };
  const difficulty = difficultyColors[course.difficulty] || difficultyColors.beginner;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/courses" className="text-[#5b5f97] hover:text-[#b8b8d1] transition">
          Courses
        </Link>
        <ChevronRight size={14} className="text-[#5b5f97]" />
        <span className="text-[#a0a0b8] truncate max-w-[200px]">{course.title}</span>
      </div>

      {/* Course Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default">{course.category}</Badge>
            <Badge className={`${difficulty.bg} ${difficulty.text} ${difficulty.border} border capitalize`}>
              {course.difficulty}
            </Badge>
            {isComplete && (
              <Badge variant="success" icon={Trophy}>Completed</Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
          <p className="text-[#a0a0b8] leading-relaxed max-w-2xl">{course.description}</p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#5b5f97]/20 rounded-lg">
                <BookOpen size={16} className="text-[#b8b8d1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#b8b8d1]">{totalLessons}</p>
                <p className="text-xs text-[#5b5f97]">Lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#5b5f97]/20 rounded-lg">
                <Clock size={16} className="text-[#b8b8d1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#b8b8d1]">{course.estimatedHours}h</p>
                <p className="text-xs text-[#5b5f97]">Duration</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2ecc71]/20 rounded-lg">
                  <Target size={16} className="text-[#2ecc71]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2ecc71]">{progressPercent}%</p>
                  <p className="text-xs text-[#5b5f97]">Complete</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress bar for logged-in users */}
          {user && totalLessons > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#a0a0b8]">{completedCount} of {totalLessons} lessons completed</span>
                <span className="text-xs text-[#5b5f97]">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-[#2ecc71]' : 'bg-[#5b5f97]'}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Continue Button */}
          {user && nextLesson && (
            <div className="mt-6">
              <Link to={`/courses/${slug}/${nextLesson.slug}`}>
                <Button icon={Play} size="lg">
                  {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#b8b8d1]">Course Content</h2>
          <span className="text-sm text-[#5b5f97]">{totalLessons} lessons</span>
        </div>
        
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => {
              const isCompleted = completedLessons.some((l) => l.lessonId === lesson.id || l === lesson.id);
              const isCurrent = nextLesson?.id === lesson.id;
              return (
                <Link
                  key={lesson.id}
                  to={`/courses/${slug}/${lesson.slug}`}
                  className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 ${
                    isCurrent 
                      ? 'border-[#5b5f97]/50 bg-[#5b5f97]/10' 
                      : 'border-[#2a2a4a] bg-[#16213e] hover:border-[#5b5f97]/50'
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-[#2ecc71]/15 text-[#2ecc71]'
                      : isCurrent
                      ? 'bg-[#5b5f97] text-white'
                      : 'bg-[#1a1a2e] text-[#5b5f97] group-hover:bg-[#5b5f97]/20'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium group-hover:text-white transition-colors ${
                      isCompleted ? 'text-[#a0a0b8]' : 'text-[#b8b8d1]'
                    }`}>{lesson.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-[10px] capitalize">{lesson.type}</Badge>
                      {lesson.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-xs text-[#5b5f97]">
                          <Clock size={10} /> {lesson.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                  {isCompleted ? (
                    <Badge variant="success" className="shrink-0">Done</Badge>
                  ) : isCurrent ? (
                    <Badge className="shrink-0 bg-[#5b5f97] text-white border-0">Up Next</Badge>
                  ) : (
                    <ChevronRight size={18} className="text-[#2a2a4a] transition-colors group-hover:text-[#5b5f97] shrink-0" />
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
