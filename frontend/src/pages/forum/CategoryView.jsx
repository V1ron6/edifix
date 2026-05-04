import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThreadCard from '../../components/forum/ThreadCard';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';
import { notifyError } from '../../components/shared/Toast';

export default function CategoryView() {
  const { categorySlug } = useParams();
  const { isAuthenticated } = useAuth();
  const [sort, setSort] = useState('latest');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThreads() {
      setLoading(true);
      try {
        const response = await api.get(`/api/forum/categories/${categorySlug}/threads?sort=${sort}`, { auth: false });
        setThreads(unwrap(response, []));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadThreads();
  }, [categorySlug, sort]);

  if (loading) return <LoadingSpinner text="Loading threads..." />;

  return (
    <main className="page-main">
      <section className="row-actions">
        {isAuthenticated ? <Link to="/forum/new"><Button>New Thread</Button></Link> : null}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="most-replies">Most replies</option>
        </select>
      </section>
      <section className="stack-list">
        {threads.map((thread) => <ThreadCard key={thread.id} categorySlug={categorySlug} thread={thread} />)}
      </section>
    </main>
  );
}
