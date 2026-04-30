import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, progressAPI, streakAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { StatCard, Card, CardHeader, CardTitle, ProgressBar, Badge } from '../components/ui';
import {
  BookOpen, Flame, Trophy, Clock, ArrowRight, Target, CheckCircle2, Activity,
  Play, Snowflake, Zap, TrendingUp, ChevronRight, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [continueData, setContinueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes] = await Promise.all([dashboardAPI.get()]);
        setData(dashRes.data.data);

        try {
          const { data: contRes } = await progressAPI.getContinue();
          setContinueData(contRes.data);
        } catch { /* no continue data */ }
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleUseFreeze = async () => {
    try {
      await streakAPI.useFreeze();
      toast.success('Streak freeze activated!');
      const { data: res } = await dashboardAPI.get();
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to use freeze');
    }
  };

  if (loading) return <LoadingScreen main="Loading dashboard" secondary="Fetching your progress" />;
  if (!data) return <p className="text-center text-[#a0a0b8]">Could not load dashboard.</p>;

  const { streak, progress, recentActivity, upcomingExams } = data;

  return (
    <div className="space-y-8">
      {/* Hero Section with Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#16213e] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,95,151,0.15)_0%,transparent_60%)]" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#5b5f97]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#f39c12]/5 blur-3xl" />
        
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-[#f39c12]" />
              <span className="text-xs font-medium text-[#f39c12]">Welcome back</span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {user?.username}
            </h1>
            <p className="mt-2 text-[#a0a0b8]">
              Keep up the great work! You're making excellent progress.
            </p>
          </div>

          {/* Streak Badge */}
          {streak?.currentStreak > 0 && (
            <div className="flex items-center gap-4 rounded-xl border border-[#f39c12]/30 bg-gradient-to-r from-[#f39c12]/10 to-transparent p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f39c12]/20">
                <Flame size={28} className="text-[#f39c12] animate-pulse" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#f39c12]">{streak.currentStreak}</p>
                <p className="text-sm text-[#a0a0b8]">Day Streak</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue Learning Card */}
      {continueData && (
        <Link
          to={`/courses/${continueData.courseSlug || continueData.course?.slug}/${continueData.lessonSlug || continueData.lesson?.slug || ''}`}
          className="group block"
        >
          <div className="relative overflow-hidden rounded-xl border border-[#5b5f97]/40 bg-gradient-to-r from-[#5b5f97]/15 via-[#16213e] to-[#16213e] p-5 transition-all duration-300 hover:border-[#5b5f97]/60 hover:shadow-[0_8px_40px_rgba(91,95,151,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#5b5f97]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#5b5f97]/20 transition-transform duration-300 group-hover:scale-110">
                <Play size={24} className="text-[#5b5f97] ml-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5b5f97]">Continue Learning</p>
                <p className="mt-1 text-lg font-bold text-white truncate">
                  {continueData.lessonTitle || continueData.lesson?.title || continueData.courseTitle || 'Next Lesson'}
                </p>
                {continueData.courseTitle && (
                  <p className="text-sm text-[#a0a0b8] truncate">{continueData.courseTitle || continueData.course?.title}</p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5b5f97] shadow-[0_4px_15px_rgba(91,95,151,0.4)] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={18} className="text-white" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${streak?.currentStreak || 0} days`}
          color="#f39c12"
        />
        <StatCard
          icon={BookOpen}
          label="Courses Completed"
          value={`${progress?.completedCourses || 0}/${progress?.totalCourses || 0}`}
          color="#5b5f97"
        />
        <StatCard
          icon={CheckCircle2}
          label="Lessons Done"
          value={`${progress?.completedLessons || 0}/${progress?.totalLessons || 0}`}
          color="#2ecc71"
        />
        <StatCard
          icon={Clock}
          label="Time Invested"
          value={formatTime(progress?.totalTimeSpent || 0)}
          color="#b8b8d1"
        />
      </div>

      {/* Overall Progress Card */}
      <Card gradient className="overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5f97]/20">
              <TrendingUp size={20} className="text-[#5b5f97]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Overall Progress</h3>
              <p className="text-xs text-[#a0a0b8]">Your learning journey</p>
            </div>
          </div>
          <Link 
            to="/courses"
            className="flex items-center gap-1.5 text-sm text-[#5b5f97] transition-colors hover:text-white"
          >
            View all courses <ChevronRight size={14} />
          </Link>
        </div>
        <ProgressBar
          value={progress?.overallProgress || 0}
          label={null}
          showPercent={true}
          color={progress?.overallProgress >= 100 ? '#2ecc71' : '#5b5f97'}
          size="lg"
          glow
        />
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#2ecc71]" />
            <span className="text-[#a0a0b8]">{progress?.completedCourses || 0} courses completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#5b5f97]" />
            <span className="text-[#a0a0b8]">{(progress?.totalCourses || 0) - (progress?.completedCourses || 0)} in progress</span>
          </div>
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card hover>
          <CardHeader>
            <CardTitle icon={Activity}>Recent Activity</CardTitle>
          </CardHeader>
          {recentActivity && recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {recentActivity.slice(0, 5).map((item, i) => (
                <li key={i} className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#5b5f97]/5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/5">
                    <CheckCircle2 size={16} className="text-[#2ecc71]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm text-[#b8b8d1] truncate group-hover:text-white transition-colors">
                      {item.lessonTitle || item.title || 'Activity'}
                    </span>
                    <span className="text-xs text-[#5b5f97]">
                      {item.courseName || 'Course'}
                    </span>
                  </div>
                  {item.timeSpentMinutes && (
                    <Badge variant="outline">{item.timeSpentMinutes}m</Badge>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5b5f97]/10">
                <Activity size={24} className="text-[#5b5f97]" />
              </div>
              <p className="text-sm text-[#a0a0b8]">No recent activity</p>
              <Link to="/courses" className="mt-2 text-sm text-[#5b5f97] hover:text-white">
                Start learning
              </Link>
            </div>
          )}
          <Link
            to="/courses"
            className="mt-4 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-white"
          >
            Browse courses <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Upcoming Exams */}
        <Card hover>
          <CardHeader>
            <CardTitle icon={Target}>Upcoming Exams</CardTitle>
            <Link to="/exams" className="text-xs text-[#5b5f97] hover:text-white transition-colors">
              View all
            </Link>
          </CardHeader>
          {upcomingExams && upcomingExams.length > 0 ? (
            <ul className="space-y-2">
              {upcomingExams.slice(0, 4).map((exam, i) => (
                <li key={i} className="group flex items-center justify-between rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-3 transition-all hover:border-[#5b5f97]/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5b5f97]/10">
                      <Target size={16} className="text-[#5b5f97]" />
                    </div>
                    <span className="text-sm font-medium text-[#b8b8d1] group-hover:text-white transition-colors">{exam.title}</span>
                  </div>
                  <Badge variant="outline" icon={Clock}>{exam.timeLimit} min</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5b5f97]/10">
                <Target size={24} className="text-[#5b5f97]" />
              </div>
              <p className="text-sm text-[#a0a0b8]">No upcoming exams</p>
              <Link to="/exams" className="mt-2 text-sm text-[#5b5f97] hover:text-white transition-colors">
                Generate an exam
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Streak Details Section */}
      <Card gradient glow>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f39c12]/20">
              <Flame size={20} className="text-[#f39c12]" />
            </div>
            <div>
              <CardTitle>Streak Details</CardTitle>
              <p className="text-xs text-[#a0a0b8]">Keep your streak alive!</p>
            </div>
          </div>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 rounded-lg bg-[#5b5f97]/10 px-3 py-1.5 text-xs font-medium text-[#5b5f97] transition-all hover:bg-[#5b5f97]/20 hover:text-white"
          >
            <Trophy size={12} /> Leaderboard
          </Link>
        </CardHeader>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-xl border border-[#f39c12]/20 bg-gradient-to-br from-[#f39c12]/10 to-transparent p-4 text-center transition-all hover:border-[#f39c12]/40 hover:shadow-[0_8px_30px_rgba(243,156,18,0.1)]">
            <p className="text-xs font-medium text-[#a0a0b8] uppercase tracking-wider">Current</p>
            <p className="mt-2 text-3xl font-bold text-[#f39c12]">{streak?.currentStreak || 0}</p>
            <p className="text-sm text-[#5b5f97]">days</p>
          </div>
          <div className="group rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#5b5f97]/40">
            <p className="text-xs font-medium text-[#a0a0b8] uppercase tracking-wider">Longest</p>
            <p className="mt-2 text-3xl font-bold text-[#b8b8d1]">{streak?.longestStreak || 0}</p>
            <p className="text-sm text-[#5b5f97]">days</p>
          </div>
          <div className="group rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#5b5f97]/40">
            <p className="text-xs font-medium text-[#a0a0b8] uppercase tracking-wider">Total Active</p>
            <p className="mt-2 text-3xl font-bold text-[#b8b8d1]">{streak?.totalActiveDays || 0}</p>
            <p className="text-sm text-[#5b5f97]">days</p>
          </div>
          <div className="group rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#5b5f97]/40">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-[#a0a0b8] uppercase tracking-wider">
              <Snowflake size={12} className="text-[#3498db]" />
              Freezes
            </div>
            <p className="mt-2 text-3xl font-bold text-[#b8b8d1]">{streak?.streakFreezes || 0}</p>
            {streak?.streakFreezes > 0 ? (
              <button
                onClick={handleUseFreeze}
                className="mt-1 inline-flex items-center gap-1 text-sm text-[#3498db] transition-colors hover:text-white"
              >
                <Zap size={12} /> Use freeze
              </button>
            ) : (
              <p className="text-sm text-[#5b5f97]">available</p>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/courses" className="group">
          <div className="flex items-center gap-4 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-300 hover:border-[#5b5f97]/50 hover:shadow-[0_8px_30px_rgba(91,95,151,0.1)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5b5f97]/15 transition-transform duration-300 group-hover:scale-110">
              <BookOpen size={22} className="text-[#5b5f97]" />
            </div>
            <div>
              <p className="font-semibold text-white">Browse Courses</p>
              <p className="text-xs text-[#a0a0b8]">Continue learning</p>
            </div>
          </div>
        </Link>
        <Link to="/exams" className="group">
          <div className="flex items-center gap-4 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-300 hover:border-[#2ecc71]/50 hover:shadow-[0_8px_30px_rgba(46,204,113,0.1)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2ecc71]/15 transition-transform duration-300 group-hover:scale-110">
              <Target size={22} className="text-[#2ecc71]" />
            </div>
            <div>
              <p className="font-semibold text-white">Take an Exam</p>
              <p className="text-xs text-[#a0a0b8]">Test your skills</p>
            </div>
          </div>
        </Link>
        <Link to="/playground" className="group">
          <div className="flex items-center gap-4 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-300 hover:border-[#f39c12]/50 hover:shadow-[0_8px_30px_rgba(243,156,18,0.1)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f39c12]/15 transition-transform duration-300 group-hover:scale-110">
              <Zap size={22} className="text-[#f39c12]" />
            </div>
            <div>
              <p className="font-semibold text-white">Code Playground</p>
              <p className="text-xs text-[#a0a0b8]">Practice coding</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
