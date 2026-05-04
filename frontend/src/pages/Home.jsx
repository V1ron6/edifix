import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="page-container home-page">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Edifix — Learn by building</h1>
          <p className="hero-sub">Practical courses, hands-on lessons, and community support to help you ship real projects.</p>
          <div className="hero-ctas">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get started — it's free</Link>
                <Link to="/login" className="btn btn-ghost">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">What you'll get</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Project-based courses</h3>
            <p>Follow practical courses that build useful, portfolio-ready projects.</p>
          </div>
          <div className="feature">
            <h3>Interactive lessons</h3>
            <p>Short lessons with exercises and quick feedback to keep you moving.</p>
          </div>
          <div className="feature">
            <h3>Community & forum</h3>
            <p>Ask questions, share progress, and get help from fellow learners.</p>
          </div>
        </div>
      </section>

      <section className="learn-more">
        <Link to="/courses" className="btn">Browse courses</Link>
      </section>
    </main>
  );
}
