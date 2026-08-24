import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="brand-icon-lg">⬡</span>
          <h1 className="auth-brand">ClinicalTrials</h1>
          <p className="auth-tagline">Management System</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {apiError && (
          <div className="alert alert-error">
            <span>⚠</span> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-icon-wrapper">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading} id="login-submit">
            {loading ? <><span className="btn-spinner" /> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
