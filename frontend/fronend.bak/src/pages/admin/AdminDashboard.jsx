import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Card, CardHeader, CardTitle, StatCard, Button } from '../../components/ui';
import {
  BookOpen, Users, FileText, MessageSquare, BarChart3, 
  Plus, Settings, Bell, Shield, Layers, Target, TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_ACTIONS = [
  { label: 'New Course', icon: BookOpen, to: '/admin/courses/new', color: '#5b5f97' },
  { label: 'New Lesson', icon: FileText, to: '/admin/lessons/new', color: '#2ecc71' },
  { label: 'New Question', icon: Target, to: '/admin/questions/new', color: '#f39c12' },
  { label: 'Broadcast', icon: Bell, to: '/admin/notifications', color: '#e74c3c' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes] = await Promise.all([
          courseAPI.getAll(),
        ]);
        setCourses(coursesRes.data.data || []);
        
        // Calculate stats from courses
        const totalLessons = coursesRes.data.data?.reduce((acc, c) => acc + (c.lessons?.length || 0), 0) || 0;
        setStats({
          totalCourses: coursesRes.data.count || coursesRes.data.data?.length || 0,
          totalLessons,
          publishedCourses: coursesRes.data.data?.filter(c => c.isPublished).length || 0,
        });
      } catch (err) {
        toast.error('Failed to load admin data');
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield size={48} className="mb-4 text-[#e74c3c]" />
        <h1 className="text-xl font-bold text-[#b8b8d1]">Access Denied</h1>
        <p className="mt-2 text-sm text-[#a0a0b8]">You need admin privileges to access this page.</p>
        <Link to="/dashboard">
          <Button variant="secondary" className="mt-4">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingScreen main="Loading Admin Panel" secondary="Fetching statistics" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b5f97]/20">
              <Shield size={16} className="text-[#5b5f97]" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#5b5f97]">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#a0a0b8]">Manage your learning platform</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="group flex flex-col items-center gap-3 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-5 transition-all hover:border-[#5b5f97]/50 hover:shadow-[0_4px_20px_rgba(91,95,151,0.08)]"
          >
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-sm font-medium text-[#b8b8d1]">{label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats?.totalCourses || 0}
          color="#5b5f97"
        />
        <StatCard
          icon={Layers}
          label="Total Lessons"
          value={stats?.totalLessons || 0}
          color="#2ecc71"
        />
        <StatCard
          icon={TrendingUp}
          label="Published"
          value={stats?.publishedCourses || 0}
          color="#f39c12"
        />
        <StatCard
          icon={Target}
          label="Draft Courses"
          value={(stats?.totalCourses || 0) - (stats?.publishedCourses || 0)}
          color="#e74c3c"
        />
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle icon={BookOpen}>Courses</CardTitle>
            <Link to="/admin/courses">
              <Button variant="ghost" size="sm" icon={Plus}>Manage</Button>
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}`}
                className="flex items-center justify-between rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 transition-all hover:border-[#5b5f97]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5b5f97]/10">
                    <BookOpen size={16} className="text-[#5b5f97]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#b8b8d1]">{course.title}</p>
                    <p className="text-xs text-[#5b5f97]">
                      {course.lessons?.length || 0} lessons · {course.category}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  course.isPublished 
                    ? 'bg-[#2ecc71]/10 text-[#2ecc71]' 
                    : 'bg-[#f39c12]/10 text-[#f39c12]'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </Link>
            ))}
            {courses.length === 0 && (
              <p className="text-center text-sm text-[#5b5f97]">No courses yet</p>
            )}
          </div>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle icon={Settings}>Management</CardTitle>
          </CardHeader>
          <div className="grid gap-3">
            <Link
              to="/admin/courses"
              className="flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-all hover:border-[#5b5f97]/30"
            >
              <BookOpen size={18} className="text-[#5b5f97]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#b8b8d1]">Course Management</p>
                <p className="text-xs text-[#a0a0b8]">Create, edit, and delete courses</p>
              </div>
            </Link>
            <Link
              to="/admin/lessons"
              className="flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-all hover:border-[#5b5f97]/30"
            >
              <FileText size={18} className="text-[#2ecc71]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#b8b8d1]">Lesson Management</p>
                <p className="text-xs text-[#a0a0b8]">Manage lessons for each course</p>
              </div>
            </Link>
            <Link
              to="/admin/questions"
              className="flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-all hover:border-[#5b5f97]/30"
            >
              <Target size={18} className="text-[#f39c12]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#b8b8d1]">Question Bank</p>
                <p className="text-xs text-[#a0a0b8]">Manage exam questions</p>
              </div>
            </Link>
            <Link
              to="/admin/notifications"
              className="flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-all hover:border-[#5b5f97]/30"
            >
              <Bell size={18} className="text-[#e74c3c]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#b8b8d1]">Notifications</p>
                <p className="text-xs text-[#a0a0b8]">Send announcements to users</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
