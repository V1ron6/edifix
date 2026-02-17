import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Badge, TabGroup, Pagination, EmptyState, Button } from '../components/ui';
import Input from '../components/ui/Input';
import { MessageSquare, Search, Eye, Heart, MessageCircle, Pin, CheckCircle2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Forum() {
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('threads');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, threadRes] = await Promise.all([
          forumAPI.getCategories(),
          forumAPI.getThreads({ sort, page, limit: 15, search: search || undefined }),
        ]);
        setCategories(catRes.data.data || []);
        setThreads(threadRes.data.data || []);
        setTotalPages(threadRes.data.totalPages || 1);
      } catch {
        toast.error('Failed to load forum');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sort, page, search]);

  if (loading && page === 1) return <LoadingScreen main="Loading forum" secondary="Fetching discussions" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forum"
        description="Discuss, ask questions, share knowledge"
        actions={
          <div className="flex gap-2">
            <TabGroup
              tabs={[
                { label: 'Categories', value: 'categories' },
                { label: 'All Threads', value: 'threads' },
              ]}
              active={view}
              onChange={setView}
            />
            <Link to="/forum/new">
              <Button icon={Plus} size="sm">New Thread</Button>
            </Link>
          </div>
        }
      />

      {view === 'categories' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/forum/c/${cat.slug}`} className="group">
              <Card hover className="h-full">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color || '#5b5f97' }}
                  />
                  <h3 className="font-semibold text-[#b8b8d1] group-hover:text-white">{cat.name}</h3>
                </div>
                <p className="mb-3 text-sm text-[#a0a0b8] line-clamp-2">{cat.description}</p>
                <Badge variant="outline">{cat.threadCount || 0} threads</Badge>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <>
          {/* Search and sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              icon={Search}
              placeholder="Search threads..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              wrapperClass="flex-1"
            />
            <div className="flex gap-1">
              {['latest', 'popular', 'most-replies'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSort(s); setPage(1); }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs capitalize transition ${
                    sort === s ? 'bg-[#5b5f97]/20 text-[#b8b8d1]' : 'text-[#a0a0b8] hover:text-[#b8b8d1]'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {threads.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No threads found"
              description="Try a different search or create a new thread."
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
                  className="flex items-start gap-4 rounded-lg border border-[#2a2a4a] bg-[#16213e] p-4 transition-all hover:border-[#5b5f97]/50 hover:shadow-[0_2px_12px_rgba(91,95,151,0.05)]"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {thread.isPinned && <Pin size={12} className="text-[#f39c12]" />}
                      {thread.isSolved && <Badge variant="success" icon={CheckCircle2}>Solved</Badge>}
                      <h3 className="font-medium text-[#b8b8d1]">{thread.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#a0a0b8]">
                      <span>{thread.author?.username}</span>
                      {thread.category && (
                        <Badge color={thread.category.color || '#5b5f97'}>
                          {thread.category.name}
                        </Badge>
                      )}
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
        </>
      )}
    </div>
  );
}
