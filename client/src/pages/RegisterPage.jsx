import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pw) => {
    if (!pw) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Weak', color: '#ef4444' },
      { strength: 2, label: 'Fair', color: '#f59e0b' },
      { strength: 3, label: 'Good', color: '#06b6d4' },
      { strength: 4, label: 'Strong', color: '#10b981' },
    ];
    return map[score];
  };

  const pwStrength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Minimum 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    else if (!/\d/.test(form.password)) e.password = 'Must contain at least one number';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      await register(form.name, form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <span className="brand-icon-lg">⬡</span>
          <h1 className="auth-brand">ClinicalTrials</h1>
          <p className="auth-tagline">Management System</p>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join the platform to manage clinical trials</p>

        {apiError && (
          <div className="alert alert-error">
            <span>⚠</span> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dr. Jane Smith"
              className={`form-input ${errors.name ? 'error' : ''}`}
              autoFocus
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-icon-wrapper">
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters with a number"
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {/* Password strength meter */}
            {form.password && (
              <div className="pw-strength">
                <div className="pw-strength-bars">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className="pw-bar"
                      style={{
                        backgroundColor: i <= pwStrength.strength ? pwStrength.color : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: pwStrength.color, fontSize: '0.75rem' }}>{pwStrength.label}</span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading} id="register-submit">
            {loading ? <><span className="btn-spinner" /> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
