import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, courseAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, CardHeader, CardTitle, ProgressBar, StatCard, EmptyState } from '../components/ui';
import {
  BookOpen, CheckCircle2, Clock, Play, ArrowRight, TrendingUp, Target,
} from 'lucide-react';
import toast from 'react-hot-toast';

function formatTime(minutes) {
  if (!minutes || minutes < 1) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function Progress() {
  const [overall, setOverall] = useState(null);
  const [continueData, setContinueData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseProgressMap, setCourseProgressMap] = useState({});
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overallRes, coursesRes] = await Promise.all([
          progressAPI.getOverall(),
          courseAPI.getAll(),
        ]);
        setOverall(overallRes.data.data);
        const allCourses = coursesRes.data.data || [];
        setCourses(allCourses);

        // Fetch per-course progress in parallel
        const progResults = await Promise.allSettled(
          allCourses.map((c) => progressAPI.getByCourse(c.id))
        );
        const map = {};
        progResults.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            map[allCourses[i].id] = r.value.data.data;
          }
        });
        setCourseProgressMap(map);

        // Fetch activity & continue
        try {
          const actRes = await progressAPI.getActivity();
          setActivity(actRes.data.data || []);
        } catch { /* optional */ }

        try {
          const contRes = await progressAPI.getContinue();
          setContinueData(contRes.data.data);
        } catch { /* optional */ }
      } catch {
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingScreen main="Loading progress" secondary="Calculating your journey" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#b8b8d1]">
          <TrendingUp size={22} className="text-[#5b5f97]" />
          My Progress
        </h1>
        <p className="mt-1 text-sm text-[#a0a0b8]">Track your learning journey across all courses</p>
      </div>

      {/* Overall stats */}
      {overall && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="Courses Completed"
              value={`${overall.completedCourses ?? 0}/${overall.totalCourses ?? 0}`}
              color="#5b5f97"
            />
            <StatCard
              icon={CheckCircle2}
              label="Lessons Done"
              value={`${overall.completedLessons ?? 0}/${overall.totalLessons ?? 0}`}
              color="#2ecc71"
            />
            <StatCard
              icon={Target}
              label="Overall Progress"
              value={`${overall.overallProgress ?? 0}%`}
              color="#f39c12"
            />
            <StatCard
              icon={Clock}
              label="Time Spent"
              value={formatTime(overall.totalTimeSpent ?? 0)}
              color="#b8b8d1"
            />
          </div>

          <Card>
            <ProgressBar
              value={overall.overallProgress ?? 0}
              label="Overall Completion"
              color="#5b5f97"
            />
          </Card>
        </>
      )}

      {/* Continue Learning */}
      {continueData && (
        <Link
          to={`/courses/${continueData.courseSlug || continueData.course?.slug}/${continueData.lessonSlug || continueData.lesson?.slug || ''}`}
          className="group flex items-center gap-4 rounded-xl border border-[#5b5f97]/30 bg-gradient-to-r from-[#5b5f97]/10 to-transparent p-5 transition-all hover:border-[#5b5f97]/50 hover:shadow-[0_4px_20px_rgba(91,95,151,0.1)]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5b5f97]/20">
            <Play size={20} className="text-[#5b5f97]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-[#5b5f97]">Continue Learning</p>
            <p className="text-sm font-semibold text-[#b8b8d1]">
              {continueData.lessonTitle || continueData.lesson?.title || 'Next Lesson'}
            </p>
            {continueData.courseTitle && (
              <p className="text-xs text-[#a0a0b8]">{continueData.courseTitle || continueData.course?.title}</p>
            )}
          </div>
          <ArrowRight size={18} className="text-[#5b5f97] transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      {/* Per-course progress */}
      {courses.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-[#b8b8d1]">Course Progress</h2>
          <div className="space-y-3">
            {courses.map((course) => {
              const prog = courseProgressMap[course.id];
              const totalLessons = course.lessons?.length || prog?.totalLessons || 0;
              const completedCount = prog?.completedLessons?.length ?? prog?.completedCount ?? 0;
              const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              const color = pct === 100 ? '#2ecc71' : pct > 0 ? '#5b5f97' : '#2a2a4a';

              return (
                <Link key={course.id} to={`/courses/${course.slug}`} className="group block">
                  <Card hover className="transition-all">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#b8b8d1] group-hover:text-white">
                          {course.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#5b5f97] capitalize">{course.category} · {course.difficulty}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-[#5b5f97]">
                        {pct}%
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      size="sm"
                      color={color}
                      showLabel={false}
                    />
                    <p className="mt-1.5 text-xs text-[#a0a0b8]">
                      {completedCount}/{totalLessons} lessons
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {activity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle icon={CheckCircle2} iconColor="text-[#2ecc71]">Recent Activity</CardTitle>
          </CardHeader>
          <ul className="space-y-2">
            {activity.slice(0, 10).map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2ecc71]/10">
                  <CheckCircle2 size={13} className="text-[#2ecc71]" />
                </div>
                <span className="flex-1 text-[#a0a0b8]">{item.lessonTitle || item.title || 'Lesson'}</span>
                {item.timeSpentMinutes && (
                  <span className="text-xs text-[#5b5f97]">{item.timeSpentMinutes}m</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!overall && !loading && (
        <EmptyState
          icon={TrendingUp}
          title="No progress yet"
          description="Start a course to begin tracking your progress."
          action={
            <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-[#5b5f97] hover:underline">
              Browse courses <ArrowRight size={14} />
            </Link>
          }
        />
      )}
    </div>
  );
}
