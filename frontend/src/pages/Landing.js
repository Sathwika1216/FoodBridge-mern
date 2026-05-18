import { Link } from 'react-router-dom';

const stats = [
  { value: '12K+', label: 'Meals redirected' },
  { value: '340+', label: 'Partner stores' },
  { value: '89', label: 'Verified NGOs' },
  { value: '18 tons', label: 'Waste prevented' },
];

const steps = [
  {
    n: '01',
    title: 'List surplus food',
    text: 'Donors upload sealed packaged or safe raw items before expiry.',
  },
  {
    n: '02',
    title: 'NGOs discover & reserve',
    text: 'Verified organizations browse, filter, and reserve nearby donations.',
  },
  {
    n: '03',
    title: 'Pickup & distribute',
    text: 'Food reaches communities in need — waste avoided, impact created.',
  },
];

const features = [
  {
    icon: '🥫',
    title: 'Safe donations only',
    text: 'Platform rules enforce unopened packaged and non-expired raw food.',
  },
  {
    icon: '⏱️',
    title: 'Expiry urgency alerts',
    text: 'Color-coded badges help NGOs prioritize urgent pickups.',
  },
  {
    icon: '📍',
    title: 'Location-based matching',
    text: 'Find food near your service area with smart filters.',
  },
  {
    icon: '📊',
    title: 'Impact tracking',
    text: 'See how much food your organization has saved from landfill.',
  },
];

const stories = [
  {
    org: 'GreenPlate NGO',
    quote: 'FoodBridge helped us serve 400 families in one week with bakery surplus.',
    city: 'Mumbai',
  },
  {
    org: 'Hope Kitchen',
    quote: 'Urgent pickup badges mean we never miss near-expiry donations.',
    city: 'Delhi',
  },
];

function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content animate-fade-up">
            <span className="hero-badge">AI-powered food rescue</span>
            <h1>
              Reduce Food Waste.
              <br />
              Feed Communities.
            </h1>
            <p>
              FoodBridge connects supermarkets, bakeries, and food businesses with verified NGOs
              to donate safe surplus food before it expires.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Donating
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                NGO Sign Up
              </Link>
            </div>
          </div>
          <div className="hero-visual animate-fade-up delay-1">
            <div className="hero-card hero-card-main">
              <span className="urgency-badge urgency-urgent">Urgent Pickup</span>
              <h3>Fresh Bakery Boxes</h3>
              <p>24 packs · Pickup today · Downtown Market</p>
            </div>
            <div className="hero-card hero-card-secondary">
              <p className="impact-num">+2,450</p>
              <p>items saved this month</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-banner">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>How It Works</h2>
            <p>Three simple steps from surplus to sustenance</p>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <article key={s.n} className="step-card">
                <span className="step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Platform Features</h2>
            <p>Built for speed, safety, and social impact</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <article key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>NGO Impact Stories</h2>
            <p>Real partners making a difference</p>
          </div>
          <div className="stories-grid">
            {stories.map((s) => (
              <blockquote key={s.org} className="story-card">
                <p>&ldquo;{s.quote}&rdquo;</p>
                <footer>
                  <strong>{s.org}</strong> · {s.city}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-box">
          <h2>Join the movement against food waste</h2>
          <p>Register as a donor or verified NGO and start bridging surplus to need.</p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-light btn-lg">
              Create Account
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg">
              See Our Impact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
