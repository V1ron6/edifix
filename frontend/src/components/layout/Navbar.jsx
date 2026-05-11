import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import NotificationBell from '../notifications/NotificationBell';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/my-learning', label: 'My Learning' },
  { to: '/playground', label: 'Playground' },
  { to: '/articles', label: 'Articles' },
  { to: '/forum', label: 'Forum' },
];

export default function Navbar({ notifications = [], showPreview = true }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="brand">Edifix</Link>
      {isAuthenticated ? (
        <>
          <nav className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <NotificationBell
              count={notifications.filter((n) => !n.isRead).length}
              preview={showPreview ? notifications : []}
            />
            <div className="user-menu">
              <Avatar username={user?.username} src={user?.avatarUrl || user?.avatar} size={32} />
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </header>
  );
}
