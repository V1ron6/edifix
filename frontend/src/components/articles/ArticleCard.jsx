import { Link } from 'react-router-dom';
import Badge from '../shared/Badge';

export default function ArticleCard({ article }) {
  return (
    <article className="card article-card">
      {article.thumbnail ? <img src={article.thumbnail} alt={article.title} className="course-thumb" /> : null}
      <h3><Link to={`/articles/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <Badge kind="info">{article.category}</Badge>
      <small>{article.readTime || 0} min • {article.author} • {article.date}</small>
    </article>
  );
}
