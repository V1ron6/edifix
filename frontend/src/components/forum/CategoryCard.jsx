import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link className="card category-card" to={`/forum/${category.slug}`}>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <small>{category.threadCount || 0} threads</small>
    </Link>
  );
}
