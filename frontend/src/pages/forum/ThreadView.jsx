import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/forum/PostCard';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';
import { notifyError, notifySuccess } from '../../components/shared/Toast';

export default function ThreadView() {
  const { categorySlug, threadSlug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reply, setReply] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const threadResponse = await api.get(`/api/forum/categories/${categorySlug}/threads/${threadSlug}`, { auth: false });

      const currentThread = unwrap(threadResponse);
      setThread(currentThread);
      const currentPostsResponse = await api.get(`/api/forum/threads/${currentThread.id}/posts`, { auth: false });
      setPosts(unwrap(currentPostsResponse, []));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [categorySlug, threadSlug]);

  const createReply = async () => {
    if (!reply.trim()) return;
    try {
      await api.post(`/api/forum/threads/${thread.id}/posts`, { content: reply });
      setReply('');
      notifySuccess('Reply posted.');
      load();
    } catch (error) {
      notifyError(error.message);
    }
  };

  const likePost = async (postId) => {
    try {
      await api.post(`/api/forum/posts/${postId}/like`);
      load();
    } catch (error) {
      notifyError(error.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading thread..." />;
  if (!thread) return <p className="page-main">Thread not found.</p>;

  return (
    <main className="page-main">
      <section className="card markdown-body">
        <h1>{thread.title}</h1>
        <ReactMarkdown>{thread.content || ''}</ReactMarkdown>
      </section>
      <section className="stack-list">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            canEdit={isAuthenticated && user?.id === post.authorId}
            onLike={likePost}
          />
        ))}
      </section>
      {isAuthenticated ? (
        <div className="reply-fixed">
          <Input id="reply" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." />
          <Button onClick={createReply}>Reply</Button>
        </div>
      ) : null}
    </main>
  );
}
