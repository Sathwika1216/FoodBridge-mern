import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const dashPath =
    user?.role === 'donor'
      ? '/donor/dashboard'
      : user?.role === 'ngo'
        ? '/ngo/dashboard'
        : user?.role === 'admin'
          ? '/admin/dashboard'
          : null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="brand-icon">🌱</span>
          FoodBridge
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>
            Impact
          </NavLink>
          {user && (
            <>
              <NavLink to="/foods" onClick={() => setOpen(false)}>
                Listings
              </NavLink>
              <NavLink to="/reservations" onClick={() => setOpen(false)}>
                Reservations
              </NavLink>
              {dashPath && (
                <NavLink to={dashPath} onClick={() => setOpen(false)}>
                  Dashboard
                </NavLink>
              )}
              <NavLink to="/notifications" onClick={() => setOpen(false)}>
                Notifications
              </NavLink>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </>
          ) : (
            <div className="nav-user">
              <span className="nav-user-name">{user.name}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
