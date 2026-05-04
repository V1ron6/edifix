import { useEffect, useState } from 'react';
import CategoryCard from '../../components/forum/CategoryCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function ForumHome() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const response = await api.get('/api/forum/categories', { auth: false });
        setCategories(unwrap(response, []));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) return <LoadingSpinner text="Loading forum..." />;

  return (
    <main className="page-main">
      <section className="card-grid">
        {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
      </section>
    </main>
  );
}
