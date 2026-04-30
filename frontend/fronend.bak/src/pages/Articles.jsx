import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Pagination, EmptyState } from '../components/ui';
import Input from '../components/ui/Input';
import { FileText, Clock, Eye, Search, Star, BookOpen, TrendingUp, Filter, Sparkles, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: Sparkles },
  { id: 'html', label: 'HTML', icon: FileText },
  { id: 'css', label: 'CSS', icon: FileText },
  { id: 'javascript', label: 'JavaScript', icon: FileText },
  { id: 'nodejs', label: 'Node.js', icon: FileText },
  { id: 'expressjs', label: 'Express.js', icon: FileText },
  { id: 'databases', label: 'Databases', icon: FileText },
  { id: 'git', label: 'Git', icon: FileText },
  { id: 'deployment', label: 'Deployment', icon: FileText },
  { id: 'best-practices', label: 'Best Practices', icon: FileText },
  { id: 'tips', label: 'Tips & Tricks', icon: FileText },
  { id: 'general', label: 'General', icon: FileText },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

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
        setTotalArticles(data.total || data.data?.length || 0);
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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-8 border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#5b5f97]/20 rounded-xl">
              <BookOpen className="text-[#b8b8d1]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
              <p className="text-[#a0a0b8]">Guides, tutorials, and best practices for web development</p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#5b5f97]" />
              <span className="text-[#b8b8d1] font-medium">{totalArticles}</span>
              <span className="text-[#a0a0b8] text-sm">Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-[#f39c12]" />
              <span className="text-[#b8b8d1] font-medium">{featured.length}</span>
              <span className="text-[#a0a0b8] text-sm">Featured</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2ecc71]" />
              <span className="text-[#b8b8d1] font-medium">{ARTICLE_CATEGORIES.length - 1}</span>
              <span className="text-[#a0a0b8] text-sm">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && page === 1 && category === 'all' && !search && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="text-[#f39c12]" size={20} />
            <h2 className="text-xl font-bold text-[#b8b8d1]">Featured Articles</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((art, idx) => (
              <Link key={art.id} to={`/articles/${art.slug}`} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5b5f97]/20 to-[#b8b8d1]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Card hover highlight className="relative h-full border-[#5b5f97]/30">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="warning" icon={Star}>Featured</Badge>
                    <span className="text-xs text-[#5b5f97]">#{idx + 1}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#b8b8d1] transition group-hover:text-white line-clamp-2">{art.title}</h3>
                  <p className="mb-4 text-sm text-[#a0a0b8] line-clamp-2">{art.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2a2a4a]">
                    <div className="flex items-center gap-3 text-xs text-[#5b5f97]">
                      <span className="flex items-center gap-1"><Clock size={12} />{art.readTimeMinutes} min</span>
                      <span className="flex items-center gap-1"><Eye size={12} />{art.viewCount}</span>
                    </div>
                    <ArrowRight size={16} className="text-[#5b5f97] group-hover:text-[#b8b8d1] group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card padding="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              icon={Search}
              placeholder="Search articles by title, content, or keywords..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              wrapperClass="flex-1"
            />
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] rounded-lg border border-[#2a2a4a]">
              <Filter size={16} className="text-[#5b5f97]" />
              <span className="text-sm text-[#a0a0b8]">{category === 'all' ? 'All' : category}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ARTICLE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategory(c.id); setPage(1); }}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  category === c.id
                    ? 'bg-[#5b5f97] text-white shadow-[0_0_15px_rgba(91,95,151,0.3)]'
                    : 'bg-[#1a1a2e] text-[#a0a0b8] hover:bg-[#2a2a4a] hover:text-[#b8b8d1] border border-[#2a2a4a]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles found"
          description="Try a different search or category filter."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#a0a0b8]">
              Showing <span className="font-medium text-[#b8b8d1]">{articles.length}</span> articles
              {category !== 'all' && <span> in <span className="text-[#5b5f97]">{category}</span></span>}
            </p>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((art) => (
              <Link key={art.id} to={`/articles/${art.slug}`} className="group">
                <Card hover className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="capitalize">{art.category}</Badge>
                    {art.createdAt && (
                      <span className="text-xs text-[#5b5f97]">{formatDate(art.createdAt)}</span>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#b8b8d1] transition group-hover:text-white line-clamp-2">{art.title}</h3>
                  <p className="mb-4 text-sm text-[#a0a0b8] line-clamp-3 flex-grow">{art.excerpt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a4a] mt-auto">
                    <div className="flex items-center gap-3 text-xs text-[#5b5f97]">
                      <span className="flex items-center gap-1"><Clock size={12} />{art.readTimeMinutes || 5} min</span>
                      <span className="flex items-center gap-1"><Eye size={12} />{art.viewCount || 0}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#5b5f97] group-hover:text-[#b8b8d1] transition">
                      Read more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
