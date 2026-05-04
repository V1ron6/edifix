export default function StatCard({ label, value }) {
  return (
    <article className="card stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
    </article>
  );
}
