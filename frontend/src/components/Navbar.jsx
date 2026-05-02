import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import {
  BookOpen, Layout, Code2, FileText, MessageSquare,
  Bell, Trophy, User, LogOut, Menu, X, ChevronDown, Clock,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/playground', label: 'Playground', icon: Code2 },
  { to: '/articles', label: 'Articles', icon: FileText },
  { to: '/forum', label: 'Forum', icon: MessageSquare },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);

  // Fetch unread notification count
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const { data } = await notificationAPI.getUnreadCount();
        setUnreadCount(data.data?.count || data.data || 0);
      } catch { /* silent */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[#5b5f97]/20 bg-[#0d0d1f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-gradient transition-all duration-300 hover:glow-sm"
        >
          EDIFIX
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5b5f97]/15 text-white'
                    : 'text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]'
                }`}
              >
                <Icon size={16} />
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-[#5b5f97]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right section */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-[#5b5f97]/15 text-white'
                    : 'text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]'
                }`}
              >
                <Layout size={16} />
                Dashboard
                {location.pathname === '/dashboard' && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-[#5b5f97]" />
                )}
              </Link>
              <Link
                to="/notifications"
                className="relative rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e74c3c] px-1 text-[10px] font-bold text-white animate-bounce">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#a0a0b8] transition-all duration-200 hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                >
                  <User size={16} />
                  <span>{user.username}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-page">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    <Link
                      to="/reminders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                    >
                      <Clock size={14} />
                      Reminders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm text-[#a0a0b8] transition-colors hover:text-[#b8b8d1]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-[#5b5f97] to-[#7c3aed] px-4 py-2 text-sm text-white transition-all hover:opacity-90 hover:shadow-[0_4px_16px_rgba(91,95,151,0.4)]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#a0a0b8] hover:text-[#b8b8d1] md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#5b5f97]/20 bg-[#0d0d1f]/95 backdrop-blur-xl px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                location.pathname.startsWith(to)
                  ? 'bg-[#5b5f97]/15 text-white'
                  : 'text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <Layout size={16} />
                Dashboard
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <Bell size={16} />
                Notifications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="mt-2 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg border border-[#2a2a4a] px-4 py-2 text-center text-sm text-[#a0a0b8]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#5b5f97] to-[#7c3aed] px-4 py-2 text-center text-sm text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
