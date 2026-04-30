import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Button, Avatar, EmptyState } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, Heart, MessageCircle, CheckCircle2, Pin, Lock, Send, Eye, Clock, ChevronRight, Tag, Share2, Check, User,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThreadView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchThread = useCallback(async () => {
    try {
      const [threadRes, postRes] = await Promise.all([
        forumAPI.getThread(id),
        forumAPI.getPosts(id, { limit: 50 }),
      ]);
      setThread(threadRes.data.data);
      setPosts(postRes.data.data || []);
    } catch {
      toast.error('Failed to load thread');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchThread(); }, [fetchThread]);

  const handleLikeThread = async () => {
    if (!user) return toast.error('Log in to like');
    try {
      const { data } = await forumAPI.likeThread(id);
      setThread((prev) => ({ ...prev, likeCount: data.data.likeCount }));
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) return toast.error('Log in to like');
    try {
      await forumAPI.likePost(postId);
      fetchThread();
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await forumAPI.createPost(id, { content: reply });
      setReply('');
      toast.success('Reply posted');
      fetchThread();
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingScreen main="Loading thread" secondary="Fetching discussion" />;
  if (!thread) return (
    <EmptyState
      icon={MessageCircle}
      title="Thread not found"
      description="This thread may have been deleted or doesn't exist."
      action={<Link to="/forum"><Button variant="secondary" size="sm">Back to Forum</Button></Link>}
    />
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/forum" className="text-[#5b5f97] hover:text-[#b8b8d1] transition">
          Forum
        </Link>
        {thread.category && (
          <>
            <ChevronRight size={14} className="text-[#5b5f97]" />
            <Link 
              to={`/forum/c/${thread.category.slug}`} 
              className="text-[#5b5f97] hover:text-[#b8b8d1] transition"
            >
              {thread.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} className="text-[#5b5f97]" />
        <span className="text-[#a0a0b8] truncate max-w-[200px]">{thread.title}</span>
      </div>

      {/* Thread Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative p-6 sm:p-8">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {thread.isPinned && (
              <Badge className="bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/30">
                <Pin size={12} className="mr-1" /> Pinned
              </Badge>
            )}
            {thread.isLocked && (
              <Badge className="bg-[#e74c3c]/15 text-[#e74c3c] border border-[#e74c3c]/30">
                <Lock size={12} className="mr-1" /> Locked
              </Badge>
            )}
            {thread.isSolved && (
              <Badge className="bg-[#2ecc71]/15 text-[#2ecc71] border border-[#2ecc71]/30">
                <CheckCircle2 size={12} className="mr-1" /> Solved
              </Badge>
            )}
            {thread.category && (
              <Badge 
                className="border" 
                style={{ 
                  borderColor: `${thread.category.color || '#5b5f97'}50`,
                  backgroundColor: `${thread.category.color || '#5b5f97'}15`,
                  color: thread.category.color || '#5b5f97'
                }}
              >
                {thread.category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{thread.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar src={thread.author?.avatar} username={thread.author?.username} size="md" />
              <div>
                <p className="font-medium text-[#b8b8d1]">{thread.author?.username}</p>
                <div className="flex items-center gap-3 text-xs text-[#a0a0b8]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(thread.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {thread.viewCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {thread.viewCount} views
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Share Button */}
            <Button 
              variant="secondary" 
              size="sm" 
              icon={copied ? Check : Share2} 
              onClick={handleShare}
              className="shrink-0"
            >
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>
      </div>

      {/* Thread Content Card */}
      <Card padding="p-6 sm:p-8">
        <div className="prose prose-invert prose-lg max-w-none text-[#e0e0e0] prose-headings:text-[#b8b8d1] prose-a:text-[#5b5f97] prose-code:text-[#b8b8d1] prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:rounded prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-[#2a2a4a] prose-pre:rounded-xl">
          <ReactMarkdown>{thread.content}</ReactMarkdown>
        </div>
        
        {/* Tags */}
        {thread.tags?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#2a2a4a] flex flex-wrap gap-2">
            {thread.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag size={10} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Thread Stats */}
        <div className="mt-6 pt-6 border-t border-[#2a2a4a] flex items-center gap-4">
          <button 
            onClick={handleLikeThread} 
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-[#e74c3c]/10 text-[#a0a0b8] hover:text-[#e74c3c] group"
          >
            <Heart size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{thread.likeCount || 0}</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2 text-[#a0a0b8]">
            <MessageCircle size={18} />
            <span className="font-medium">{thread.replyCount || posts.length}</span>
            <span className="text-sm">replies</span>
          </div>
        </div>
      </Card>

      {/* Replies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#b8b8d1]">
            {posts.length > 0 ? `${posts.length} Replies` : 'Replies'}
          </h2>
        </div>
        
        {posts.length === 0 ? (
          <Card padding="p-8" className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#5b5f97]/10 flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-[#5b5f97]" />
            </div>
            <p className="text-[#a0a0b8]">No replies yet. Be the first to respond!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post, index) => (
              <Card
                key={post.id}
                padding="p-5"
                className={post.isSolution ? 'border-[#2ecc71]/30 bg-[#2ecc71]/5' : ''}
              >
                {post.isSolution && (
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#2ecc71]/20">
                    <Badge variant="success" icon={CheckCircle2}>Accepted Solution</Badge>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <Avatar src={post.author?.avatar} username={post.author?.username} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#b8b8d1]">{post.author?.username}</span>
                        {post.author?.id === thread.author?.id && (
                          <Badge variant="outline" className="text-[10px]">OP</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5b5f97]">
                        <span>#{index + 1}</span>
                        <span>\u2022</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.isEdited && <span className="text-[#a0a0b8]">(edited)</span>}
                      </div>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-[#e0e0e0]">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button 
                        onClick={() => handleLikePost(post.id)} 
                        className="flex items-center gap-1.5 text-xs text-[#a0a0b8] hover:text-[#e74c3c] transition group"
                      >
                        <Heart size={14} className="group-hover:scale-110 transition-transform" />
                        <span>{post.likeCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      {user && !thread.isLocked ? (
        <Card padding="p-5">
          <h3 className="font-semibold text-[#b8b8d1] mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-[#5b5f97]/20 rounded-lg">
              <Send size={14} className="text-[#b8b8d1]" />
            </div>
            Post a Reply
          </h3>
          <form onSubmit={handleReply}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply here... Markdown is supported!"
              className="mb-4 h-32 w-full resize-y rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-sm text-[#e0e0e0] placeholder-[#5b5f97] outline-none transition focus:border-[#5b5f97] focus:ring-2 focus:ring-[#5b5f97]/20"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5b5f97]">Supports Markdown formatting</p>
              <Button type="submit" icon={Send} loading={submitting} disabled={!reply.trim()}>
                {submitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </form>
        </Card>
      ) : thread.isLocked ? (
        <Card padding="p-6" className="text-center border-[#e74c3c]/20 bg-[#e74c3c]/5">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#e74c3c]/15 flex items-center justify-center mb-3">
            <Lock size={20} className="text-[#e74c3c]" />
          </div>
          <p className="text-[#a0a0b8]">This thread is locked. No new replies can be posted.</p>
        </Card>
      ) : (
        <Card padding="p-6" className="text-center border-[#5b5f97]/20">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#5b5f97]/15 flex items-center justify-center mb-3">
            <User size={20} className="text-[#5b5f97]" />
          </div>
          <p className="text-[#a0a0b8] mb-3">Log in to join the discussion</p>
          <Link to="/login">
            <Button variant="primary" size="sm">Log In</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
