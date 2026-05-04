import Button from '../shared/Button';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import ReactMarkdown from 'react-markdown';

export default function PostCard({ post, canEdit, onLike }) {
  return (
    <article className="card post-card">
      <div className="thread-meta">
        <Avatar username={post.author?.username || 'U'} src={post.author?.avatar} size={28} />
        <strong>{post.author?.username || 'Unknown'}</strong>
      </div>
      <ReactMarkdown>{post.content || ''}</ReactMarkdown>
      {post.isSolution ? <Badge kind="success">Solution</Badge> : null}
      <div className="post-actions">
        <Button variant="secondary" onClick={() => onLike(post.id || post._id)}>Like ({post.likeCount || 0})</Button>
        {canEdit ? <Button variant="ghost">Edit</Button> : null}
        {canEdit ? <Button variant="danger">Delete</Button> : null}
      </div>
      {(post.replies || []).map((reply) => (
        <div key={reply.id || reply._id} className="nested-reply">
          <ReactMarkdown>{reply.content}</ReactMarkdown>
        </div>
      ))}
    </article>
  );
}
