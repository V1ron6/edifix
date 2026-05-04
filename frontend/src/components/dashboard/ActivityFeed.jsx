export default function ActivityFeed({ items = [] }) {
  return (
    <section className="card activity-feed">
      <h3>Activity Feed</h3>
      {items.length === 0 ? <p>No recent activity.</p> : null}
      {items.map((item) => (
        <div key={item.id || item._id} className="feed-item">
          <p>{item.message || `Completed ${item.lessonTitle}`}</p>
          <small>{item.time || item.createdAt}</small>
        </div>
      ))}
    </section>
  );
}
