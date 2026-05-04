export default function NotificationItem({ item }) {
  return (
    <article className="card notification-item">
      <p>{item.message}</p>
      <small>{item.timestamp || item.createdAt}</small>
      {!item.read ? <span className="unread-dot" /> : null}
    </article>
  );
}
