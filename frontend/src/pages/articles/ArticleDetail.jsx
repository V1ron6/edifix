import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/articles/ArticleCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const response = await api.get(`/api/articles/slug/${slug}`, { auth: false });
        const current = unwrap(response);
        setArticle(current);
        const relatedResponse = await api.get(`/api/articles?category=${current.category}`, { auth: false });
        setRelated(unwrap(relatedResponse, []).filter((item) => item.slug !== slug).slice(0, 3));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading article..." />;
  if (!article) return <p className="page-main">Article not found.</p>;

  return (
    <main className="page-main">
      <section className="card markdown-body">
        <h1>{article.title}</h1>
        <ReactMarkdown>{article.content || ''}</ReactMarkdown>
      </section>
      <section className="card-grid">
        {related.map((item) => <ArticleCard key={item.id} article={item} />)}
      </section>
    </main>
  );
}
