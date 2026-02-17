import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Button, Badge, EmptyState, TabGroup } from '../components/ui';
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, MessageCircle, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const NOTIF_ICONS = {
  info: { icon: Info, color: '#5b5f97' },
  success: { icon: Trophy, color: '#2ecc71' },
  warning: { icon: AlertTriangle, color: '#f39c12' },
  forum: { icon: MessageCircle, color: '#3498db' },
  default: { icon: Bell, color: '#5b5f97' },
};

function getNotifStyle(type) {
  return NOTIF_ICONS[type] || NOTIF_ICONS.default;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll({ unreadOnly: filter === 'unread' });
      setNotifications(data.data || []);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark all');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationAPI.clearRead();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      toast.success('Read notifications cleared');
    } catch {
      toast.error('Failed to clear');
    }
  };

  if (loading) return <LoadingScreen main="Loading notifications" secondary="Checking updates" />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearRead}>
              Clear read
            </Button>
          </>
        }
      />

      <TabGroup
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
        ]}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'All caught up!' : 'No notifications'}
          description={filter === 'unread' ? "You've read all your notifications." : 'Notifications will appear here.'}
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const { icon: NIcon, color } = getNotifStyle(notif.type);
            return (
              <Card
                key={notif.id}
                hover
                highlight={!notif.isRead}
                className={`flex items-start gap-3 transition-all duration-200 ${
                  !notif.isRead ? '!border-[#5b5f97]/30 !bg-[#5b5f97]/5' : ''
                }`}
                padding="p-4"
              >
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <NIcon size={16} style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${notif.isRead ? 'text-[#a0a0b8]' : 'text-[#b8b8d1]'}`}>
                    {notif.title}
                  </p>
                  {notif.message && (
                    <p className="mt-0.5 text-xs text-[#a0a0b8] line-clamp-2">{notif.message}</p>
                  )}
                  <p className="mt-1 text-[10px] text-[#5b5f97]">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="rounded-md p-1.5 text-[#a0a0b8] transition hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="rounded-md p-1.5 text-[#a0a0b8] transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
