import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import {
  BookOpen, Layout, Code2, FileText, MessageSquare,
  Bell, Trophy, User, LogOut, Menu, X, ChevronDown, Clock,
  Shield, Zap, Terminal,
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

  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="sticky top-0 z-40 border-b border-[#1f2b37] bg-[#0d141dcc] backdrop-blur-xl">
      <div className="border-b border-[#1f2b37]/80 bg-[#101923]/80">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px] text-[#8ba0b3] md:px-6">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-[#9fef00]" />
            <span className="font-medium tracking-wide">LIVE SECURITY TRACKS</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Zap size={12} className="text-[#00d1ff]" />
            <span>Daily rooms and labs are active</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3 text-[#dbe6f2]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#9fef00]/40 bg-[#9fef00]/10 shadow-[0_0_18px_rgba(159,239,0,0.18)]">
            <Terminal size={17} className="text-[#9fef00]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-[0.2em]">EDIFIX</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#8ba0b3] group-hover:text-[#9fef00]">academy</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                location.pathname.startsWith(to)
                  ? 'border-[#9fef00]/40 bg-[#9fef00]/10 text-[#e8ffd0]'
                  : 'border-transparent text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  isDashboard
                    ? 'border-[#00d1ff]/40 bg-[#00d1ff]/10 text-[#c8f5ff]'
                    : 'border-transparent text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]'
                }`}
              >
                <Layout size={16} />
                Dashboard
              </Link>
              <Link
                to="/notifications"
                className="relative rounded-lg border border-transparent p-2 text-[#8ba0b3] transition-all hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5d73] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg border border-[#25374a] bg-[#15222f]/70 px-3 py-2 text-sm text-[#dbe6f2] hover:border-[#9fef00]/40"
                >
                  <User size={16} />
                  <span>{user.username}</span>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#1f2b37] bg-[#101923] py-1 shadow-[0_18px_40px_rgba(0,0,0,0.45)] animate-page">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#8ba0b3] transition-colors hover:bg-[#15222f] hover:text-[#dbe6f2]"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    <Link
                      to="/reminders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#8ba0b3] transition-colors hover:bg-[#15222f] hover:text-[#dbe6f2]"
                    >
                      <Clock size={14} />
                      Reminders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#8ba0b3] hover:bg-[#15222f] hover:text-[#dbe6f2]"
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
                className="rounded-lg border border-transparent px-4 py-2 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-[#9fef00]/60 bg-[#9fef00] px-4 py-2 text-sm font-semibold text-[#09130a] shadow-[0_10px_24px_rgba(159,239,0,0.25)] hover:bg-[#b6ff35]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-[#25374a] bg-[#15222f]/70 p-2 text-[#8ba0b3] hover:text-[#dbe6f2] md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#1f2b37] bg-[#0f1822] px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
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
                className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
              >
                <Layout size={16} />
                Dashboard
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
              >
                <Bell size={16} />
                Notifications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-[#8ba0b3] hover:border-[#25374a] hover:bg-[#15222f] hover:text-[#dbe6f2]"
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
                className="flex-1 rounded-lg border border-[#25374a] px-4 py-2 text-center text-sm text-[#8ba0b3]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg border border-[#9fef00]/60 bg-[#9fef00] px-4 py-2 text-center text-sm font-semibold text-[#09130a]"
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
