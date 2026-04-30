import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, TabGroup, Pagination, EmptyState, Button, Avatar } from '../components/ui';
import Input from '../components/ui/Input';
import { MessageSquare, Search, Eye, Heart, MessageCircle, Pin, CheckCircle2, Plus, Users, TrendingUp, Clock, Sparkles, ArrowRight, Filter, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Forum() {
  const { user } = useAuth();
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

  const totalThreads = threads.length || categories.reduce((acc, c) => acc + (c.threadCount || 0), 0);
  const totalReplies = threads.reduce((acc, t) => acc + (t.replyCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#16213e] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(243,156,18,0.1)_0%,transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#f39c12]/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Users size={16} className="text-[#f39c12]" />
              <span className="text-xs font-medium text-[#f39c12]">Community</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Forum</h1>
            <p className="mt-2 text-[#a0a0b8]">Discuss, ask questions, and share knowledge with fellow learners</p>
          </div>
          
          <Link to="/forum/new">
            <Button icon={Plus} size="lg" className="shadow-[0_4px_20px_rgba(91,95,151,0.3)]">
              New Thread
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-white">{categories.length}</p>
            <p className="text-xs text-[#a0a0b8]">Categories</p>
          </div>
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-[#5b5f97]">{totalThreads}</p>
            <p className="text-xs text-[#a0a0b8]">Threads</p>
          </div>
          <div className="rounded-xl bg-[#1a1a2e]/50 p-3 text-center">
            <p className="text-2xl font-bold text-[#f39c12]">{totalReplies}</p>
            <p className="text-xs text-[#a0a0b8]">Replies</p>
          </div>
        </div>
      </div>

      {/* View Toggle and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabGroup
          tabs={[
            { label: 'Categories', value: 'categories' },
            { label: 'All Threads', value: 'threads' },
          ]}
          active={view}
          onChange={setView}
        />
        
        {view === 'threads' && (
          <div className="flex gap-3">
            <Input
              icon={Search}
              placeholder="Search threads..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              wrapperClass="w-64"
            />
          </div>
        )}
      </div>

      {view === 'categories' ? (
        /* Categories Grid */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id} 
              to={`/forum/c/${cat.slug}`} 
              className="group block"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-[#2a2a4a] bg-[#16213e] p-5 transition-all duration-300 hover:border-[#5b5f97]/50 hover:shadow-[0_8px_40px_rgba(91,95,151,0.12)] hover:-translate-y-1">
                {/* Hover gradient */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at top right, ${cat.color || '#5b5f97'}15 0%, transparent 60%)` }}
                />
                
                <div className="relative">
                  {/* Icon */}
                  <div 
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color || '#5b5f97'}20` }}
                  >
                    <MessageSquare size={22} style={{ color: cat.color || '#5b5f97' }} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#b8b8d1]">
                    {cat.name}
                  </h3>
                  <p className="mb-4 text-sm text-[#a0a0b8] line-clamp-2">{cat.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between border-t border-[#2a2a4a] pt-4">
                    <div className="flex items-center gap-4 text-xs text-[#5b5f97]">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {cat.threadCount || 0} threads
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5b5f97] opacity-0 transition-all duration-300 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
                      Browse <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#5b5f97]" />
            <span className="text-xs text-[#a0a0b8]">Sort by:</span>
            <div className="flex gap-1 rounded-lg bg-[#1a1a2e] p-1">
              {[
                { value: 'latest', label: 'Latest' },
                { value: 'popular', label: 'Popular' },
                { value: 'most-replies', label: 'Most Replies' },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => { setSort(s.value); setPage(1); }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    sort === s.value
                      ? 'bg-[#5b5f97]/20 text-white'
                      : 'text-[#a0a0b8] hover:text-[#b8b8d1]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {threads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2a2a4a] bg-[#16213e]/50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5b5f97]/10">
                <MessageSquare size={28} className="text-[#5b5f97]" />
              </div>
              <h3 className="text-lg font-semibold text-[#b8b8d1]">No threads found</h3>
              <p className="mt-2 text-sm text-[#a0a0b8]">Try a different search or create a new thread</p>
              <Link to="/forum/new" className="mt-4 inline-block">
                <Button icon={Plus} size="sm">Create Thread</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((thread, idx) => (
                <Link
                  key={thread.id}
                  to={`/forum/t/${thread.id}`}
                  className="group block"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="flex items-start gap-4 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-300 hover:border-[#5b5f97]/50 hover:shadow-[0_4px_20px_rgba(91,95,151,0.1)]">
                    {/* Author Avatar */}
                    <Avatar 
                      src={thread.author?.avatar} 
                      username={thread.author?.username} 
                      size="md"
                      className="shrink-0 hidden sm:flex"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {thread.isPinned && (
                          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#f39c12]/15">
                            <Pin size={10} className="text-[#f39c12]" />
                          </div>
                        )}
                        {thread.isSolved && (
                          <Badge variant="success" icon={CheckCircle2}>Solved</Badge>
                        )}
                        <h3 className="text-base font-medium text-white transition-colors group-hover:text-[#5b5f97]">
                          {thread.title}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-[#a0a0b8]">
                          by <span className="font-medium text-[#b8b8d1]">{thread.author?.username}</span>
                        </span>
                        {thread.category && (
                          <Badge color={thread.category.color || '#5b5f97'}>
                            {thread.category.name}
                          </Badge>
                        )}
                        {thread.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[#5b5f97]">#{tag}</span>
                        ))}
                        <span className="flex items-center gap-1 text-[#5b5f97]">
                          <Clock size={10} />
                          {formatTimeAgo(thread.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="hidden shrink-0 items-center gap-5 text-xs text-[#5b5f97] sm:flex">
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Eye size={14} />
                          <span className="font-medium text-[#b8b8d1]">{thread.viewCount || 0}</span>
                        </div>
                        <span className="text-[10px] text-[#5b5f97]">views</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <MessageCircle size={14} />
                          <span className="font-medium text-[#b8b8d1]">{thread.replyCount || 0}</span>
                        </div>
                        <span className="text-[10px] text-[#5b5f97]">replies</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Heart size={14} />
                          <span className="font-medium text-[#b8b8d1]">{thread.likeCount || 0}</span>
                        </div>
                        <span className="text-[10px] text-[#5b5f97]">likes</span>
                      </div>
                    </div>
                    
                    {/* Mobile stats */}
                    <div className="flex shrink-0 items-center gap-3 text-xs text-[#5b5f97] sm:hidden">
                      <span className="flex items-center gap-1"><MessageCircle size={12} />{thread.replyCount || 0}</span>
                      <span className="flex items-center gap-1"><Heart size={12} />{thread.likeCount || 0}</span>
                    </div>
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

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
