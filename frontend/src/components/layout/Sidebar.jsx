import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/Avatar';

export default function Sidebar({ user, streak = 0, nextLesson }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <Avatar username={user?.username || 'User'} src={user?.avatarUrl || user?.avatar} size={44} />
        <div>
          <p className="sidebar-name">{user?.username || 'Learner'}</p>
          <p className="sidebar-role">{user?.role || 'Student'}</p>
        </div>
      </div>
      <p className="streak-pill"><Flame size={14} /> {streak} day streak</p>
      <nav className="sidebar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/exams/1">Exams</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      {nextLesson ? (
        <Link className="continue-shortcut" to={`/courses/${nextLesson.courseSlug}/${nextLesson.lessonSlug}`}>
          Continue learning
        </Link>
      ) : null}
    </aside>
  );
}
