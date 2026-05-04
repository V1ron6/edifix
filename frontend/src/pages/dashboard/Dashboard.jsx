import { useEffect, useState } from 'react';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import ContinueCard from '../../components/dashboard/ContinueCard';
import StatCard from '../../components/dashboard/StatCard';
import StreakWidget from '../../components/dashboard/StreakWidget';
import Sidebar from '../../components/layout/Sidebar';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(null);
  const [continueLesson, setContinueLesson] = useState(null);
  const [activity, setActivity] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [progressRes, streakRes, continueRes, activityRes] = await Promise.all([
        api.get('/api/progress'),
        api.get('/api/streak'),
        api.get('/api/progress/continue'),
        api.get('/api/progress/activity'),
      ]);

      setProgress(unwrap(progressRes));
      setStreak(unwrap(streakRes));
      setContinueLesson(unwrap(continueRes));
      setActivity(unwrap(activityRes, []));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const useFreeze = async () => {
    try {
      await api.post('/api/streak/use-freeze');
      notifySuccess('Streak freeze used.');
      load();
    } catch (error) {
      notifyError(error.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const overview = progress?.overall || {};

  return (
    <div className="page-with-sidebar">
      <Sidebar user={user} streak={streak?.currentStreak || 0} nextLesson={continueLesson?.lesson || continueLesson} />
      <main className="page-main">
        <section className="stats-grid">
          <StatCard label="Courses completed" value={progress?.frontend?.courses?.filter((c) => c.status === 'completed').length || 0} />
          <StatCard label="Lessons completed" value={overview.completedLessons || 0} />
          <StatCard label="Overall progress" value={`${overview.percentage || 0}%`} />
          <StatCard label="Time spent" value={`${Math.round((overview.completedLessons || 0) * 18)} min`} />
        </section>
        <section className="two-col">
          <StreakWidget streakData={streak} onUseFreeze={useFreeze} />
          <ContinueCard lesson={continueLesson?.lesson || continueLesson} />
        </section>
        <ActivityFeed items={Array.isArray(activity) ? activity : activity?.data || []} />
      </main>
    </div>
  );
}
