import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Button, Avatar, EmptyState } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import {
<<<<<<< HEAD
  ArrowLeft, Heart, MessageCircle, CheckCircle2, Pin, Lock, Send, Eye, Clock, ChevronRight, Tag, Share2, Check, User,
=======
  ArrowLeft, Heart, MessageCircle, CheckCircle2, Pin, Lock, Send,
  Pencil, Trash2, X, Check,
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThreadView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Thread edit state
  const [editingThread, setEditingThread] = useState(false);
  const [threadEdit, setThreadEdit] = useState({ title: '', content: '' });

  // Post edit state
  const [editingPostId, setEditingPostId] = useState(null);
  const [postEditContent, setPostEditContent] = useState('');

  const isAdmin = user?.role === 'admin';

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

<<<<<<< HEAD
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
=======
  // Thread edit/delete
  const startEditThread = () => {
    setThreadEdit({ title: thread.title, content: thread.content });
    setEditingThread(true);
  };

  const handleSaveThreadEdit = async () => {
    try {
      await forumAPI.updateThread(id, threadEdit);
      toast.success('Thread updated');
      setEditingThread(false);
      fetchThread();
    } catch {
      toast.error('Failed to update thread');
    }
  };

  const handleDeleteThread = async () => {
    if (!window.confirm('Delete this thread?')) return;
    try {
      await forumAPI.deleteThread(id);
      toast.success('Thread deleted');
      navigate('/forum');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Admin toggles
  const handleSolveThread = async () => {
    try {
      await forumAPI.solveThread(id, { isSolved: !thread.isSolved });
      fetchThread();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleTogglePin = async () => {
    try {
      await forumAPI.updateThread(id, { isPinned: !thread.isPinned });
      fetchThread();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleToggleLock = async () => {
    try {
      await forumAPI.updateThread(id, { isLocked: !thread.isLocked });
      fetchThread();
    } catch {
      toast.error('Failed to update');
    }
  };

  // Post edit/delete
  const startEditPost = (post) => {
    setEditingPostId(post.id);
    setPostEditContent(post.content);
  };

  const handleSavePostEdit = async (postId) => {
    try {
      await forumAPI.updatePost(postId, { content: postEditContent });
      toast.success('Post updated');
      setEditingPostId(null);
      fetchThread();
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await forumAPI.deletePost(postId);
      toast.success('Post deleted');
      fetchThread();
    } catch {
      toast.error('Failed to delete');
    }
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
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

  const isThreadAuthor = user && (user.id === thread.author?.id || user.id === thread.authorId);
  const canEditThread = isThreadAuthor || isAdmin;
  const canDeleteThread = isThreadAuthor || isAdmin;

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

<<<<<<< HEAD
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
=======
      {/* Thread Header */}
      <Card className="p-6">
        {editingThread ? (
          <div className="space-y-3">
            <input
              value={threadEdit.title}
              onChange={(e) => setThreadEdit({ ...threadEdit, title: e.target.value })}
              className="w-full rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e0e0e0] outline-none focus:border-[#5b5f97]"
            />
            <textarea
              value={threadEdit.content}
              onChange={(e) => setThreadEdit({ ...threadEdit, content: e.target.value })}
              rows={6}
              className="w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm text-[#e0e0e0] outline-none focus:border-[#5b5f97]"
            />
            <div className="flex gap-2">
              <Button icon={Check} size="sm" onClick={handleSaveThreadEdit}>Save</Button>
              <Button icon={X} size="sm" variant="secondary" onClick={() => setEditingThread(false)}>Cancel</Button>
            </div>
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
          </div>
        ) : (
          <>
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
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#2a2a4a] pt-3 text-xs text-[#5b5f97]">
              <button onClick={handleLikeThread} className="flex items-center gap-1 transition hover:text-[#e74c3c]">
                <Heart size={14} /> {thread.likeCount}
              </button>
              <span className="flex items-center gap-1"><MessageCircle size={14} /> {thread.replyCount} replies</span>
              <div className="ml-auto flex items-center gap-1.5">
                {canEditThread && (
                  <button
                    onClick={startEditThread}
                    className="flex items-center gap-1 rounded px-2 py-1 transition hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                )}
                {canDeleteThread && (
                  <button
                    onClick={handleDeleteThread}
                    className="flex items-center gap-1 rounded px-2 py-1 transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button
                      onClick={handleSolveThread}
                      className={`flex items-center gap-1 rounded px-2 py-1 transition ${thread.isSolved ? 'text-[#2ecc71] hover:bg-[#2ecc71]/10' : 'hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'}`}
                    >
                      <CheckCircle2 size={12} /> {thread.isSolved ? 'Unsolve' : 'Solve'}
                    </button>
                    <button
                      onClick={handleTogglePin}
                      className={`flex items-center gap-1 rounded px-2 py-1 transition ${thread.isPinned ? 'text-[#f39c12] hover:bg-[#f39c12]/10' : 'hover:bg-[#f39c12]/10 hover:text-[#f39c12]'}`}
                    >
                      <Pin size={12} /> {thread.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={handleToggleLock}
                      className={`flex items-center gap-1 rounded px-2 py-1 transition ${thread.isLocked ? 'text-[#e74c3c] hover:bg-[#e74c3c]/10' : 'hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]'}`}
                    >
                      <Lock size={12} /> {thread.isLocked ? 'Unlock' : 'Lock'}
                    </button>
                  </>
                )}
              </div>
            </div>
            {thread.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
          </>
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

<<<<<<< HEAD
      {/* Replies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#b8b8d1]">
            {posts.length > 0 ? `${posts.length} Replies` : 'Replies'}
          </h2>
=======
      {/* Posts */}
      {posts.length === 0 ? (
        <div className="py-6 text-center text-sm text-[#a0a0b8]">No replies yet. Be the first to respond.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const isPostAuthor = user && (user.id === post.author?.id || user.id === post.authorId);
            const canEditPost = isPostAuthor || isAdmin;
            return (
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

                {editingPostId === post.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={postEditContent}
                      onChange={(e) => setPostEditContent(e.target.value)}
                      rows={4}
                      className="w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm text-[#e0e0e0] outline-none focus:border-[#5b5f97]"
                    />
                    <div className="flex gap-2">
                      <Button icon={Check} size="sm" onClick={() => handleSavePostEdit(post.id)}>Save</Button>
                      <Button icon={X} size="sm" variant="secondary" onClick={() => setEditingPostId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-sm text-[#e0e0e0]">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-[#5b5f97]">
                  <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 transition hover:text-[#e74c3c]">
                    <Heart size={12} /> {post.likeCount}
                  </button>
                  {post.isEdited && <span className="text-[#a0a0b8]">(edited)</span>}
                  {canEditPost && editingPostId !== post.id && (
                    <div className="ml-auto flex items-center gap-1.5">
                      <button
                        onClick={() => startEditPost(post)}
                        className="flex items-center gap-1 rounded px-1.5 py-0.5 transition hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1 rounded px-1.5 py-0.5 transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
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
