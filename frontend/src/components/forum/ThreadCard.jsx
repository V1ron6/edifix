import { Link } from 'react-router-dom';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';

export default function ThreadCard({ categorySlug, thread }) {
  return (
    <article className="card">
      <Link to={`/forum/${categorySlug}/${thread.slug}`}><h3>{thread.title}</h3></Link>
      <div className="thread-meta">
        <Avatar username={thread.author?.username || 'U'} src={thread.author?.avatar} size={24} />
        <span>{thread.author?.username || 'Unknown'}</span>
      </div>
      <div className="thread-tags">
        {(thread.tags || []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>
      <p>{thread.replyCount || 0} replies • {thread.viewCount || 0} views • {thread.likeCount || 0} likes</p>
      {thread.solved ? <Badge kind="success">Solved</Badge> : null}
      {thread.pinned ? <Badge kind="info">Pinned</Badge> : null}
      <small>{thread.lastActivity || thread.updatedAt}</small>
    </article>
  );
}
