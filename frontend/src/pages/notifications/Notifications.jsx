import { useEffect, useState } from 'react';
import NotificationItem from '../../components/notifications/NotificationItem';
import Pagination from '../../components/shared/Pagination';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ pages: 1 });

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get(`/api/notifications?page=${page}`);
        const data = unwrap(response);
        setItems(data?.notifications || []);
        setPagination(data?.pagination || { pages: 1 });
      } catch (error) {
        notifyError(error.message);
      }
    }

    loadNotifications();
  }, [page]);

  return (
    <main className="page-main">
      <section className="stack-list">
        {items.map((item) => <NotificationItem key={item.id} item={item} />)}
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
