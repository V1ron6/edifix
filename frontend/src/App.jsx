import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ToastPortal from './components/shared/Toast';
import { useAuth } from './context/AuthContext';
import ArticleDetail from './pages/articles/ArticleDetail';
import ArticleList from './pages/articles/ArticleList';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CourseDetail from './pages/courses/CourseDetail';
import CourseList from './pages/courses/CourseList';
import MyLearning from './pages/courses/MyLearning';
import Dashboard from './pages/dashboard/Dashboard';
import ExamPage from './pages/exams/ExamPage';
import ExamResults from './pages/exams/ExamResults';
import CategoryView from './pages/forum/CategoryView';
import ForumHome from './pages/forum/ForumHome';
import NewThread from './pages/forum/NewThread';
import ThreadView from './pages/forum/ThreadView';
import LessonView from './pages/lessons/LessonView';
import Notifications from './pages/notifications/Notifications';
import NotFound from './pages/NotFound';
import Playground from './pages/playground/Playground';
import Leaderboard from './pages/profile/Leaderboard';
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import Home from './pages/Home';
import { api } from './utils/api';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function AppShell() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const applyPrefs = () => {
      const raw = localStorage.getItem('edifix_ui_prefs');
      let prefs = {};
      try {
        prefs = raw ? JSON.parse(raw) : {};
      } catch {
      }

      document.body.classList.toggle('compact-cards', Boolean(prefs.compactCards));
      document.body.classList.toggle('reduce-motion', Boolean(prefs.reduceMotion));
      setShowPreview(prefs.showForumPreview !== false);
    };

    applyPrefs();
    window.addEventListener('storage', applyPrefs);
    return () => window.removeEventListener('storage', applyPrefs);
  }, []);

  useEffect(() => {
    async function loadNotificationPreview() {
      if (!isAuthenticated) {
        setNotifications([]);
        return;
      }

      try {
        const payload = await api.get('/api/notifications');
        setNotifications(payload.data?.notifications || payload.notifications || []);
      } catch {
        setNotifications([]);
      }
    }

    loadNotificationPreview();
  }, [isAuthenticated]);

  return (
    <>
      <ToastPortal />
      <Navbar notifications={notifications} showPreview={showPreview} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/courses/:courseSlug/:lessonSlug" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
        <Route path="/exams/:courseId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/exams/results" element={<ProtectedRoute><ExamResults /></ProtectedRoute>} />
        <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/forum" element={<ForumHome />} />
        <Route path="/forum/new" element={<ProtectedRoute><NewThread /></ProtectedRoute>} />
        <Route path="/forum/:categorySlug" element={<CategoryView />} />
        <Route path="/forum/:categorySlug/:threadSlug" element={<ThreadView />} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppShell;