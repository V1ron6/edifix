import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Button, Avatar, EmptyState } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, Heart, MessageCircle, CheckCircle2, Pin, Lock, Send,
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
    <div className="mx-auto max-w-3xl space-y-4">
      <Link to="/forum" className="inline-flex items-center gap-1 text-sm text-[#5b5f97] transition hover:text-[#b8b8d1]">
        <ArrowLeft size={14} /> Back to forum
      </Link>

      {/* Thread Header */}
      <Card className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {thread.isPinned && <Badge variant="warning" icon={Pin}>Pinned</Badge>}
          {thread.isLocked && <Badge variant="danger" icon={Lock}>Locked</Badge>}
          {thread.isSolved && <Badge variant="success" icon={CheckCircle2}>Solved</Badge>}
          {thread.category && (
            <Badge color={thread.category.color || '#5b5f97'}>{thread.category.name}</Badge>
          )}
        </div>
        <h1 className="text-xl font-bold text-[#b8b8d1]">{thread.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={thread.author?.username} size="sm" />
          <div>
            <span className="text-sm text-[#b8b8d1]">{thread.author?.username}</span>
            <span className="ml-2 text-xs text-[#5b5f97]">{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="prose prose-invert mt-4 max-w-none text-sm text-[#e0e0e0]">
          <ReactMarkdown>{thread.content}</ReactMarkdown>
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-[#2a2a4a] pt-3 text-xs text-[#5b5f97]">
          <button onClick={handleLikeThread} className="flex items-center gap-1 transition hover:text-[#e74c3c]">
            <Heart size={14} /> {thread.likeCount}
          </button>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {thread.replyCount} replies</span>
        </div>
        {thread.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {thread.tags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="py-6 text-center text-sm text-[#a0a0b8]">No replies yet. Be the first to respond.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`p-4 ${post.isSolution ? '!border-[#2ecc71]/30 !bg-[#2ecc71]/5' : ''}`}
            >
              {post.isSolution && (
                <Badge variant="success" icon={CheckCircle2} className="mb-2">Accepted Solution</Badge>
              )}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={post.author?.username} size="sm" />
                  <span className="text-sm font-medium text-[#b8b8d1]">{post.author?.username}</span>
                </div>
                <span className="text-xs text-[#5b5f97]">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="prose prose-invert max-w-none text-sm text-[#e0e0e0]">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-[#5b5f97]">
                <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 transition hover:text-[#e74c3c]">
                  <Heart size={12} /> {post.likeCount}
                </button>
                {post.isEdited && <span className="text-[#a0a0b8]">(edited)</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reply form */}
      {user && !thread.isLocked ? (
        <Card className="p-4">
          <form onSubmit={handleReply}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply (Markdown supported)..."
              className="mb-3 h-28 w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm text-[#e0e0e0] placeholder-[#5b5f97] outline-none transition focus:border-[#5b5f97]"
            />
            <Button type="submit" icon={Send} loading={submitting} disabled={!reply.trim()}>
              Post Reply
            </Button>
          </form>
        </Card>
      ) : thread.isLocked ? (
        <div className="rounded-lg border border-[#e74c3c]/20 bg-[#e74c3c]/5 p-4 text-center text-sm text-[#a0a0b8]">
          <Lock size={16} className="mx-auto mb-2 text-[#e74c3c]" />
          This thread is locked. No new replies can be posted.
        </div>
      ) : null}
    </div>
  );
}
