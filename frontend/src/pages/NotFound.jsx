import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link to="/">
          <Button>Back Home</Button>
        </Link>
      </section>
    </main>
  );
}
