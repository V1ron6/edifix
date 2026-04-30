import { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Button, Badge, EmptyState, Pagination } from '../../components/ui';
import Input, { TextArea } from '../../components/ui/Input';
import { FileText, Plus, Pencil, Trash2, X, Check, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'html', 'css', 'javascript', 'nodejs', 'expressjs',
  'databases', 'git', 'deployment', 'best-practices', 'tips', 'general',
];

const EMPTY_FORM = {
  title: '',
  content: '',
  excerpt: '',
  category: 'general',
  tags: '',
  readTimeMinutes: 5,
  isPublished: false,
  isFeatured: false,
  thumbnail: '',
  source: '',
};

export default function AdminArticles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await articleAPI.adminGetAll({ page, limit: 15 });
      setArticles(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || 'general',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
      readTimeMinutes: article.readTimeMinutes || 5,
      isPublished: article.isPublished ?? false,
      isFeatured: article.isFeatured ?? false,
      thumbnail: article.thumbnail || '',
      source: article.source || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error('Title and content are required');
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        readTimeMinutes: Number(form.readTimeMinutes) || 5,
      };
      if (editingId) {
        await articleAPI.update(editingId, payload);
        toast.success('Article updated');
      } else {
        await articleAPI.create(payload);
        toast.success('Article created');
      }
      setShowForm(false);
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await articleAPI.delete(id);
      toast.success('Article deleted');
      fetchArticles();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePublished = async (article) => {
    try {
      await articleAPI.update(article.id, { isPublished: !article.isPublished });
      fetchArticles();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleToggleFeatured = async (article) => {
    try {
      await articleAPI.update(article.id, { isFeatured: !article.isFeatured });
      fetchArticles();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Article Management"
        description="Create, edit, and manage platform articles"
        actions={
          showForm ? (
            <Button variant="secondary" icon={X} onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          ) : (
            <Button icon={Plus} onClick={openCreate}>
              New Article
            </Button>
          )
        }
      />

      {/* Create / Edit Form */}
      {showForm && (
        <Card highlight padding="p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#b8b8d1]">
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Article title"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="Short description shown in lists..."
                className="w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm text-[#e0e0e0] placeholder-[#5b5f97]/40 outline-none transition focus:border-[#5b5f97]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Content (Markdown)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                placeholder="Full article content in Markdown..."
                className="w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 font-mono text-sm text-[#e0e0e0] placeholder-[#5b5f97]/40 outline-none transition focus:border-[#5b5f97]"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#5b5f97]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="html, tips, best-practices"
              />
              <Input
                label="Read Time (minutes)"
                type="number"
                min={1}
                value={form.readTimeMinutes}
                onChange={(e) => setForm({ ...form, readTimeMinutes: e.target.value })}
              />
              <Input
                label="Thumbnail URL (optional)"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Input
              label="Source URL (optional)"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="https://original-source.com"
            />
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-[#a0a0b8]">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5b5f97]"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-[#a0a0b8]">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5b5f97]"
                />
                Featured
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={submitting} icon={Check}>
                {submitting ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
              </Button>
              <Button type="button" variant="secondary" icon={X} onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Articles list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles yet"
          description="Create your first article to get started."
          action={<Button icon={Plus} onClick={openCreate}>Create Article</Button>}
        />
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <Card key={article.id} hover className="flex flex-wrap items-center gap-3" padding="p-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="capitalize text-[10px]">{article.category}</Badge>
                  {article.isFeatured && (
                    <Badge variant="info" icon={Star} className="text-[10px]">Featured</Badge>
                  )}
                  {!article.isPublished && (
                    <Badge variant="warning" className="text-[10px]">Draft</Badge>
                  )}
                </div>
                <p className="truncate text-sm font-medium text-[#b8b8d1]">{article.title}</p>
                <p className="mt-0.5 text-xs text-[#5b5f97]">
                  {article.viewCount ?? 0} views · {article.readTimeMinutes ?? 0} min read
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => handleToggleFeatured(article)}
                  title={article.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  className={`rounded-md p-1.5 transition ${
                    article.isFeatured
                      ? 'text-[#f39c12] hover:bg-[#f39c12]/10'
                      : 'text-[#a0a0b8] hover:bg-[#f39c12]/10 hover:text-[#f39c12]'
                  }`}
                >
                  <Star size={14} />
                </button>
                <button
                  onClick={() => handleTogglePublished(article)}
                  title={article.isPublished ? 'Unpublish' : 'Publish'}
                  className={`rounded-md p-1.5 transition ${
                    article.isPublished
                      ? 'text-[#2ecc71] hover:bg-[#2ecc71]/10'
                      : 'text-[#a0a0b8] hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                  }`}
                >
                  {article.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => openEdit(article)}
                  className="rounded-md p-1.5 text-[#a0a0b8] transition hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="rounded-md p-1.5 text-[#a0a0b8] transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
