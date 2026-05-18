import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div>
        <h3>🌱 FoodBridge</h3>
        <p>Connecting surplus food with NGOs to fight hunger and reduce waste.</p>
      </div>
      <div>
        <h4>Platform</h4>
        <Link to="/foods">Browse Food</Link>
        <Link to="/register">Register</Link>
        <Link to="/about">Our Impact</Link>
      </div>
      <div>
        <h4>Guidelines</h4>
        <p>Only sealed packaged or safe raw non-expired food.</p>
        <p>No opened, homemade, or cooked leftovers.</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} FoodBridge. Reducing waste, feeding communities.</p>
    </div>
  </footer>
);

export default Footer;
