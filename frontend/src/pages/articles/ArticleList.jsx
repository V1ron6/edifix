import { useEffect, useState } from 'react';
import ArticleCard from '../../components/articles/ArticleCard';
import Input from '../../components/shared/Input';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function ArticleList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (category) query.set('category', category);
        const response = await api.get(`/api/articles?${query.toString()}`, { auth: false });
        setArticles(unwrap(response, []));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [search, category]);

  if (loading) return <LoadingSpinner text="Loading articles..." />;

  return (
    <main className="page-main">
      <section className="row-actions">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="javascript">JavaScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="general">General</option>
        </select>
        <Input id="search" placeholder="Search articles" value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <section className="card-grid">
        {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </section>
    </main>
  );
}
