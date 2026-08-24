import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '◈' },
    { to: '/trials', label: 'Trials', icon: '◉' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-text">
            <span className="brand-primary">Clinical</span>
            <span className="brand-secondary">Trials</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen((p) => !p)}
                aria-label="User menu"
              >
                <div className="avatar">{getInitials(user?.name)}</div>
                <span className="user-name">{user?.name}</span>
                <span className={`chevron ${dropdownOpen ? 'open' : ''}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="avatar avatar-lg">{getInitials(user?.name)}</div>
                    <div>
                      <div className="dropdown-name">{user?.name}</div>
                      <div className="dropdown-email">{user?.email}</div>
                      <span className="role-badge">{user?.role}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <span>⎋</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isAuthenticated && (
            <button
              className="hamburger"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle mobile menu"
            >
              <span className={mobileOpen ? 'open' : ''} />
              <span className={mobileOpen ? 'open' : ''} />
              <span className={mobileOpen ? 'open' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <button className="mobile-logout" onClick={handleLogout}>
            ⎋ Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
