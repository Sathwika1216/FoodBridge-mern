import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function About() {
  const { user } = useAuth();
  const saved = user?.foodSavedCount || 0;
  const badge =
    saved >= 50
      ? '🥇 Gold Rescuer'
      : saved >= 20
        ? '🥈 Silver Rescuer'
        : saved >= 5
          ? '🥉 Bronze Rescuer'
          : '🌱 Getting Started';

  return (
    <div className="page container about-page">
      <div className="page-header">
        <h1>Our Impact</h1>
        <p>Turning surplus into sustenance — one donation at a time</p>
      </div>

      <section className="impact-hero">
        <div className="impact-card">
          <h2>🌱 Food Saved Counter</h2>
          <p className="impact-big">{user ? saved : '—'}</p>
          <p className="muted">
            {user ? 'Your personal contribution in food units saved' : 'Sign in to track your impact'}
          </p>
        </div>
        <div className="impact-card">
          <h2>🏅 Sustainability Badge</h2>
          <p className="badge-display">{badge}</p>
          <p className="muted">Earn badges by completing food pickups</p>
        </div>
      </section>

      <section className="panel">
        <h2>Mission</h2>
        <p>
          FoodBridge reduces food wastage by connecting businesses with verified NGOs. We focus
          exclusively on safe, sealed packaged food and non-expired raw items — never opened,
          homemade, or cooked leftovers.
        </p>
      </section>

      <section className="panel">
        <h2>Platform impact</h2>
        <div className="stats-row">
          <div className="stat-card">
            <p className="stat-label">Meals redirected</p>
            <h3 className="stat-value">12,000+</h3>
          </div>
          <div className="stat-card">
            <p className="stat-label">Waste prevented</p>
            <h3 className="stat-value">18 tons</h3>
          </div>
          <div className="stat-card">
            <p className="stat-label">Partner NGOs</p>
            <h3 className="stat-value">89</h3>
          </div>
        </div>
      </section>

      {!user && (
        <div className="cta-inline">
          <Link to="/register" className="btn btn-primary btn-lg">
            Join FoodBridge
          </Link>
        </div>
      )}
    </div>
  );
}

export default About;
