import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell({ count = 0, preview = [] }) {
  return (
    <div className="bell-wrap">
      <Link to="/notifications" className="icon-link" aria-label="Notifications">
        <Bell size={18} />
        {count > 0 ? <span className="bell-count">{count}</span> : null}
      </Link>
      {preview.length > 0 ? (
        <div className="bell-preview">
          {preview.slice(0, 5).map((item) => (
            <p key={item.id || item._id}>{item.message}</p>
          ))}
          <Link to="/notifications">See all</Link>
        </div>
      ) : null}
    </div>
  );
}
