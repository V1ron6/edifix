import Button from '../shared/Button';

export default function NotificationItem({ item, onMarkRead, onDelete }) {
  return (
    <article className="card notification-item">
      {item.title ? <strong>{item.title}</strong> : null}
      <p>{item.message}</p>
      <small>{item.timestamp || item.createdAt}</small>
      {!item.isRead ? <span className="unread-dot" /> : null}
      <div className="row-actions wrap-row">
        {!item.isRead ? (
          <Button variant="secondary" onClick={() => onMarkRead(item.id)}>Mark read</Button>
        ) : null}
        <Button variant="ghost" onClick={() => onDelete(item.id)}>Delete</Button>
      </div>
    </article>
  );
}
