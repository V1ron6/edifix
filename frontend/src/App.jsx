import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import Exams from './pages/Exams';
import ExamTake from './pages/ExamTake';
import Playground from './pages/Playground';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import Forum from './pages/Forum';
import ForumCategory from './pages/ForumCategory';
import ThreadView from './pages/ThreadView';
import NewThread from './pages/NewThread';
import Notifications from './pages/Notifications';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Notfound from './pages/Notfound.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#16213e',
              color: '#e0e0e0',
              border: '1px solid #2a2a4a',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/courses/:courseSlug/:lessonSlug" element={<LessonView />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleView />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/c/:slug" element={<ForumCategory />} />
            <Route path="/forum/t/:id" element={<ThreadView />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="*" element={<Notfound />} />
            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/exams/:id" element={<ProtectedRoute><ExamTake /></ProtectedRoute>} />
            <Route path="/forum/new" element={<ProtectedRoute><NewThread /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
