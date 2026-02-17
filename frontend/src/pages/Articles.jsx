import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Badge, Pagination, EmptyState } from '../components/ui';
import Input from '../components/ui/Input';
import { FileText, Clock, Eye, Search, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ARTICLE_CATEGORIES = [
  'all', 'html', 'css', 'javascript', 'nodejs', 'expressjs',
  'databases', 'git', 'deployment', 'best-practices', 'tips', 'general',
];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        const { data } = await articleAPI.getAll(params);
        setArticles(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        toast.error('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [category, page, search]);

  useEffect(() => {
    articleAPI.getFeatured(3)
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => {});
  }, []);

  if (loading && page === 1) return <LoadingScreen main="Loading articles" secondary="Fetching content" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Articles" description="Guides, tips, and best practices" />

      {/* Featured */}
      {featured.length > 0 && page === 1 && category === 'all' && !search && (
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((art) => (
            <Link key={art.id} to={`/articles/${art.slug}`} className="group">
              <Card hover highlight className="h-full">
                <Badge variant="info" icon={Star} className="mb-3">Featured</Badge>
                <h3 className="mb-1 font-semibold text-[#b8b8d1] transition group-hover:text-white">{art.title}</h3>
                <p className="mb-3 text-xs text-[#a0a0b8] line-clamp-2">{art.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-[#5b5f97]">
                  <span className="flex items-center gap-1"><Clock size={10} />{art.readTimeMinutes} min</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{art.viewCount}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          icon={Search}
          placeholder="Search articles..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          wrapperClass="flex-1"
        />
        <div className="flex flex-wrap gap-1">
          {ARTICLE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`rounded-lg px-2.5 py-1 text-xs capitalize transition ${
                category === c
                  ? 'bg-[#5b5f97]/20 text-[#b8b8d1]'
                  : 'text-[#a0a0b8] hover:text-[#b8b8d1]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles found"
          description="Try a different search or category filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <Link key={art.id} to={`/articles/${art.slug}`} className="group">
              <Card hover className="h-full">
                <Badge variant="outline" className="mb-3 capitalize">{art.category}</Badge>
                <h3 className="mb-1 font-semibold text-[#b8b8d1] transition group-hover:text-white">{art.title}</h3>
                <p className="mb-3 text-sm text-[#a0a0b8] line-clamp-2">{art.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[#5b5f97]">
                  <span className="flex items-center gap-1"><Clock size={10} />{art.readTimeMinutes} min read</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{art.viewCount}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
