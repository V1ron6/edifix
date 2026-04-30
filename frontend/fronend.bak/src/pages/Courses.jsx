import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Badge, TabGroup, EmptyState, ProgressBar } from '../components/ui';
import { BookOpen, Clock, ArrowRight, Layers, GraduationCap, TrendingUp, CheckCircle2, Play, Code2, Terminal, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
];

const DIFFICULTY_COLORS = {
  beginner: '#2ecc71',
  intermediate: '#f39c12',
  advanced: '#e74c3c',
};

const DIFFICULTY_LABELS = {
  beginner: 'Beginner Friendly',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const CATEGORY_ICONS = {
  frontend: Code2,
  backend: Terminal,
};

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        const { data } = await courseAPI.getAll(params);
        setCourses(data.data || []);

        // Fetch progress for logged in users
        if (user) {
          try {
            const { data: progData } = await progressAPI.getOverall();
            // Create a map of course progress
            const progressMap = {};
            if (progData.data?.courses) {
              progData.data.courses.forEach(c => {
                progressMap[c.courseId] = c;
              });
            }
            setProgress(progressMap);
          } catch { /* no progress data */ }
        }
      } catch {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, user]);

  if (loading) return <LoadingScreen main="Loading courses" secondary="Fetching course catalog" />;

  const frontendCourses = courses.filter(c => c.category === 'frontend');
  const backendCourses = courses.filter(c => c.category === 'backend');
  const displayCourses = category ? courses : null;

  const getCourseProgress = (courseId) => {
    const p = progress[courseId];
    if (!p) return 0;
    return p.completedLessons && p.totalLessons ? Math.round((p.completedLessons / p.totalLessons) * 100) : 0;
  };

  const isCompleted = (courseId) => getCourseProgress(courseId) >= 100;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#16213e] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,95,151,0.12)_0%,transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#5b5f97]/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap size={16} className="text-[#5b5f97]" />
              <span className="text-xs font-medium text-[#5b5f97]">Learning Path</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Course Catalog</h1>
            <p className="mt-2 text-[#a0a0b8]">Follow the structured curriculum from basics to advanced</p>
          </div>
          
          <TabGroup
            tabs={FILTERS}
            active={category}
            onChange={setCategory}
          />
        </div>

        {/* Stats row */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-white">{courses.length}</p>
            <p className="text-xs text-[#a0a0b8]">Total Courses</p>
          </div>
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-[#5b5f97]">{frontendCourses.length}</p>
            <p className="text-xs text-[#a0a0b8]">Frontend</p>
          </div>
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-[#2ecc71]">{backendCourses.length}</p>
            <p className="text-xs text-[#a0a0b8]">Backend</p>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses available"
          description="Check back soon for new courses."
        />
      ) : displayCourses ? (
        // Filtered view - grid of cards
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayCourses.map((course, idx) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={getCourseProgress(course.id)}
              completed={isCompleted(course.id)}
              index={idx}
            />
          ))}
        </div>
      ) : (
        // Default view - separated by category
        <div className="space-y-10">
          {/* Frontend Section */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5f97]/15">
                  <Code2 size={20} className="text-[#5b5f97]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Frontend Development</h2>
                  <p className="text-xs text-[#a0a0b8]">{frontendCourses.length} courses</p>
                </div>
              </div>
              <Badge color="#5b5f97">Start here</Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {frontendCourses.map((course, idx) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={getCourseProgress(course.id)}
                  completed={isCompleted(course.id)}
                  index={idx}
                />
              ))}
            </div>
          </section>

          {/* Backend Section */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2ecc71]/15">
                  <Terminal size={20} className="text-[#2ecc71]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Backend Development</h2>
                  <p className="text-xs text-[#a0a0b8]">{backendCourses.length} courses</p>
                </div>
              </div>
              <Badge color="#2ecc71">Advanced</Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {backendCourses.map((course, idx) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={getCourseProgress(course.id)}
                  completed={isCompleted(course.id)}
                  index={idx}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, progress = 0, completed = false, index = 0 }) {
  const CategoryIcon = CATEGORY_ICONS[course.category] || BookOpen;
  
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#2a2a4a] bg-[#16213e] p-5 transition-all duration-300 hover:border-[#5b5f97]/50 hover:shadow-[0_8px_40px_rgba(91,95,151,0.12)] hover:-translate-y-1">
        {/* Completed badge overlay */}
        {completed && (
          <div className="absolute right-3 top-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2ecc71] shadow-[0_4px_12px_rgba(46,204,113,0.4)]">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          </div>
        )}
        
        {/* Hover gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at bottom right, ${DIFFICULTY_COLORS[course.difficulty]}08 0%, transparent 50%)` }}
        />

        <div className="relative">
          {/* Icon and Category */}
          <div className="mb-4 flex items-center justify-between">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${course.category === 'frontend' ? '#5b5f97' : '#2ecc71'}15` }}
            >
              <CategoryIcon size={22} style={{ color: course.category === 'frontend' ? '#5b5f97' : '#2ecc71' }} />
            </div>
            <Badge 
              color={DIFFICULTY_COLORS[course.difficulty]} 
              dot
              className="capitalize"
            >
              {course.difficulty}
            </Badge>
          </div>

          {/* Title and Description */}
          <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#b8b8d1]">
            {course.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-[#a0a0b8] line-clamp-2">
            {course.description}
          </p>

          {/* Progress bar (if any) */}
          {progress > 0 && (
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[#5b5f97]">Progress</span>
                <span className="font-medium text-[#b8b8d1]">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1a2e]">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress >= 100 ? '#2ecc71' : '#5b5f97'
                  }}
                />
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between border-t border-[#2a2a4a] pt-4 text-xs text-[#5b5f97]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Layers size={14} />
                {course.lessons?.length || 0} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {course.estimatedHours}h
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 transition-all duration-300 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
              {progress > 0 ? 'Continue' : 'Start'} <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
