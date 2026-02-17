import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Badge, Pagination, EmptyState, Button } from '../components/ui';
import {
  ArrowLeft, Eye, Heart, MessageCircle, Pin, CheckCircle2, Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForumCategory() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, threadRes] = await Promise.all([
          forumAPI.getCategoryBySlug(slug),
          forumAPI.getCategoryThreads(slug, { sort, page, limit: 15 }),
        ]);
        setCategory(catRes.data.data);
        setThreads(threadRes.data.data || []);
        setTotalPages(threadRes.data.totalPages || 1);
      } catch {
        toast.error('Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, sort, page]);

  if (loading && page === 1) return <LoadingScreen main="Loading category" secondary={slug?.replace(/-/g, ' ')} />;
  if (!category && !loading) return <EmptyState icon={MessageCircle} title="Category not found" />;

  return (
    <div className="space-y-6">
      <Link to="/forum" className="flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]">
        <ArrowLeft size={14} /> Back to forum
      </Link>

      {category && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: category.color || '#5b5f97' }}
            />
            <div>
              <h1 className="text-2xl font-bold text-[#b8b8d1]">{category.name}</h1>
              {category.description && (
                <p className="text-sm text-[#a0a0b8]">{category.description}</p>
              )}
            </div>
          </div>
          <Link to="/forum/new">
            <Button icon={Plus} size="sm">New Thread</Button>
          </Link>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-1">
        {['latest', 'popular', 'most-replies'].map((s) => {
          return (
            <button
              key={s}
              onClick={() => { setSort(s); setPage(1); } }
              className={`rounded-lg px-2.5 py-1.5 text-xs capitalize transition ${sort === s ? 'bg-[#5b5f97]/20 text-[#b8b8d1]' : "text-[#a0a0b8] hover:text-[#b8b8d1]"} `}
            >
              {s.replace('-', ' ')}
            </button>
          );
        })}
      </div>

      {/* Threads */}
      {threads.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No threads yet"
          description="Be the first to start a discussion in this category."
          action={
            <Link to="/forum/new">
              <Button icon={Plus} size="sm">Create Thread</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={`/forum/t/${thread.id}`}
              className="flex items-start gap-4 rounded-lg border border-[#2a2a4a] bg-[#16213e] p-4 transition-all hover:border-[#5b5f97]/50"
            >
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {thread.isPinned && <Pin size={12} className="text-[#f39c12]" />}
                  {thread.isSolved && <Badge variant="success" icon={CheckCircle2}>Solved</Badge>}
                  <h3 className="font-medium text-[#b8b8d1]">{thread.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#a0a0b8]">
                  <span>{thread.author?.username}</span>
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                  {thread.tags?.map((tag) => (
                    <span key={tag} className="text-[#5b5f97]">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-xs text-[#5b5f97]">
                <span className="flex items-center gap-1"><Eye size={12} />{thread.viewCount}</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} />{thread.replyCount}</span>
                <span className="flex items-center gap-1"><Heart size={12} />{thread.likeCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
