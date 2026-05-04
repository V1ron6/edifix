import { useEffect, useState } from 'react';
import NotificationItem from '../../components/notifications/NotificationItem';
import Button from '../../components/shared/Button';
import Pagination from '../../components/shared/Pagination';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ pages: 1 });

  const loadNotifications = async () => {
    try {
      const response = await api.get(`/api/notifications?page=${page}`);
      const data = unwrap(response);
      setItems(data?.notifications || []);
      setPagination(data?.pagination || { pages: 1 });
    } catch (error) {
      notifyError(error.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [page]);

  const markRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      notifyError(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      notifySuccess('Notification deleted.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const markAll = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      notifySuccess('All notifications marked as read.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const clearRead = async () => {
    try {
      await api.delete('/api/notifications/clear-read');
      setItems((prev) => prev.filter((item) => !item.isRead));
      notifySuccess('Read notifications cleared.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <main className="page-main">
      <section className="row-actions wrap-row">
        <Button variant="secondary" onClick={markAll}>Mark all as read</Button>
        <Button variant="ghost" onClick={clearRead}>Clear read notifications</Button>
      </section>
      <section className="stack-list">
        {items.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onMarkRead={markRead}
            onDelete={remove}
          />
        ))}
      </section>
      <Pagination
        page={page}
        hasNext={page < (pagination.pages || 1)}
        onPrev={() => setPage((value) => Math.max(1, value - 1))}
        onNext={() => setPage((value) => value + 1)}
      />
    </main>
  );
}
