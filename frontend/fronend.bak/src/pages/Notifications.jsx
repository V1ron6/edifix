import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, Badge, EmptyState, TabGroup } from '../components/ui';
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, MessageCircle, Trophy, Inbox, Sparkles, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const NOTIF_ICONS = {
  info: { icon: Info, color: '#5b5f97', bg: 'bg-[#5b5f97]/10' },
  success: { icon: Trophy, color: '#2ecc71', bg: 'bg-[#2ecc71]/10' },
  warning: { icon: AlertTriangle, color: '#f39c12', bg: 'bg-[#f39c12]/10' },
  forum: { icon: MessageCircle, color: '#3498db', bg: 'bg-[#3498db]/10' },
  default: { icon: Bell, color: '#5b5f97', bg: 'bg-[#5b5f97]/10' },
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
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-8 border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-3 bg-[#5b5f97]/20 rounded-xl">
                  <Bell className="text-[#b8b8d1]" size={28} />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-[#e74c3c] text-white text-xs font-bold rounded-full px-1 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-[#a0a0b8]">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up!'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearRead}>
                Clear read
              </Button>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-[#5b5f97]" />
              <span className="text-[#b8b8d1] font-medium">{notifications.length}</span>
              <span className="text-[#a0a0b8] text-sm">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#f39c12]" />
              <span className="text-[#b8b8d1] font-medium">{unreadCount}</span>
              <span className="text-[#a0a0b8] text-sm">Unread</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#2ecc71]" />
              <span className="text-[#b8b8d1] font-medium">{notifications.length - unreadCount}</span>
              <span className="text-[#a0a0b8] text-sm">Read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card padding="p-2">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#5b5f97] ml-2" />
          <TabGroup
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            ]}
            active={filter}
            onChange={(v) => { setFilter(v); setLoading(true); }}
          />
        </div>
      </Card>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'All caught up!' : 'No notifications'}
          description={filter === 'unread' ? "You've read all your notifications." : 'Notifications will appear here.'}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const { icon: NIcon, color, bg } = getNotifStyle(notif.type);
            return (
              <Card
                key={notif.id}
                hover
                highlight={!notif.isRead}
                className={`group transition-all duration-200 ${
                  !notif.isRead ? '!border-[#5b5f97]/30 !bg-[#5b5f97]/5' : ''
                }`}
                padding="p-0"
              >
                <div className="flex items-start gap-4 p-4">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${bg}`}
                  >
                    <NIcon size={20} style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium ${notif.isRead ? 'text-[#a0a0b8]' : 'text-[#b8b8d1]'}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="shrink-0 w-2 h-2 bg-[#5b5f97] rounded-full mt-2"></span>
                      )}
                    </div>
                    {notif.message && (
                      <p className="mt-1 text-sm text-[#a0a0b8] line-clamp-2">{notif.message}</p>
                    )}
                    <p className="mt-2 text-xs text-[#5b5f97]">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center justify-end gap-1 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#a0a0b8] transition hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]"
                    >
                      <Check size={14} />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#a0a0b8] transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                  >
                    <Trash2 size={14} />
                    Delete
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
