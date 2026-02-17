import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, progressAPI, streakAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { StatCard, Card, CardHeader, CardTitle, ProgressBar, Badge } from '../components/ui';
import {
  BookOpen, Flame, Trophy, Clock, ArrowRight, Target, CheckCircle2, Activity,
  Play, Snowflake, Zap,
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
        const [dashRes] = await Promise.all([
          dashboardAPI.get(),
        ]);
        setData(dashRes.data.data);

        // Fetch continue learning data
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
      toast.success('Streak freeze used');
      // Refresh
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
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">
            Welcome back, {user?.username}
          </h1>
          <p className="text-sm text-[#a0a0b8]">Here is your learning overview.</p>
        </div>
        {streak?.currentStreak > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-[#f39c12]/20 bg-[#f39c12]/5 px-4 py-2">
            <Flame size={18} className="text-[#f39c12]" />
            <span className="text-sm font-semibold text-[#f39c12]">{streak.currentStreak} day streak</span>
          </div>
        )}
      </div>

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
              {continueData.lessonTitle || continueData.lesson?.title || continueData.courseTitle || 'Next Lesson'}
            </p>
            {continueData.courseTitle && (
              <p className="text-xs text-[#a0a0b8]">{continueData.courseTitle || continueData.course?.title}</p>
            )}
          </div>
          <ArrowRight size={18} className="text-[#5b5f97] transition-transform group-hover:translate-x-1" />
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
          label="Time Spent"
          value={formatTime(progress?.totalTimeSpent || 0)}
          color="#b8b8d1"
        />
      </div>

      {/* Progress Bar */}
      <Card>
        <ProgressBar
          value={progress?.overallProgress || 0}
          label="Overall Progress"
          color="#5b5f97"
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle icon={Activity}>Recent Activity</CardTitle>
          </CardHeader>
          {recentActivity && recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {recentActivity.slice(0, 5).map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2ecc71]/10">
                    <CheckCircle2 size={14} className="text-[#2ecc71]" />
                  </div>
                  <span className="flex-1 text-[#a0a0b8]">{item.lessonTitle || item.title || 'Activity'}</span>
                  {item.timeSpentMinutes && (
                    <span className="text-xs text-[#5b5f97]">{item.timeSpentMinutes}m</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#a0a0b8]">No recent activity. Start a course to begin.</p>
          )}
          <Link
            to="/courses"
            className="mt-4 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
          >
            Browse courses <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle icon={Target}>Upcoming Exams</CardTitle>
            <Link to="/exams" className="text-xs text-[#5b5f97] hover:text-[#b8b8d1]">
              View all
            </Link>
          </CardHeader>
          {upcomingExams && upcomingExams.length > 0 ? (
            <ul className="space-y-3">
              {upcomingExams.slice(0, 5).map((exam, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm">
                  <span className="text-[#b8b8d1]">{exam.title}</span>
                  <Badge variant="outline" icon={Clock}>{exam.timeLimit} min</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center py-6">
              <Target size={24} className="mb-2 text-[#5b5f97]/40" />
              <p className="text-sm text-[#a0a0b8]">No upcoming exams.</p>
              <Link to="/exams" className="mt-2 text-xs text-[#5b5f97] hover:text-[#b8b8d1]">
                Generate an exam
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Streak Details */}
      <Card>
        <CardHeader>
          <CardTitle icon={Flame} iconColor="text-[#f39c12]">Streak Details</CardTitle>
          <Link
            to="/leaderboard"
            className="flex items-center gap-1 text-xs text-[#5b5f97] hover:text-[#b8b8d1]"
          >
            <Trophy size={12} /> Leaderboard
          </Link>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-center">
            <p className="text-xs text-[#a0a0b8]">Current</p>
            <p className="mt-1 text-xl font-bold text-[#f39c12]">{streak?.currentStreak || 0}</p>
            <p className="text-xs text-[#5b5f97]">days</p>
          </div>
          <div className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-center">
            <p className="text-xs text-[#a0a0b8]">Longest</p>
            <p className="mt-1 text-xl font-bold text-[#b8b8d1]">{streak?.longestStreak || 0}</p>
            <p className="text-xs text-[#5b5f97]">days</p>
          </div>
          <div className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-center">
            <p className="text-xs text-[#a0a0b8]">Total Active</p>
            <p className="mt-1 text-xl font-bold text-[#b8b8d1]">{streak?.totalActiveDays || 0}</p>
            <p className="text-xs text-[#5b5f97]">days</p>
          </div>
          <div className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-center">
            <p className="text-xs text-[#a0a0b8]">Freezes Left</p>
            <p className="mt-1 text-xl font-bold text-[#b8b8d1]">{streak?.streakFreezes || 0}</p>
            {streak?.streakFreezes > 0 && (
              <button
                onClick={handleUseFreeze}
                className="mt-1 text-xs text-[#5b5f97] hover:text-[#b8b8d1]"
              >
                Use freeze
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
