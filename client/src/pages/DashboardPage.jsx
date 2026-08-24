import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import StatusBadge from '../components/StatusBadge';

const STAT_CARDS = [
  { key: 'Recruiting', icon: '⬤', label: 'Recruiting' },
  { key: 'Active',     icon: '◉', label: 'Active'     },
  { key: 'Completed', icon: '✓', label: 'Completed'  },
  { key: 'Pending',   icon: '○', label: 'Pending'    },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/trials/stats');
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const getStatusCount = (statusKey) => {
    if (!stats?.statusBreakdown) return 0;
    const found = stats.statusBreakdown.find((s) => s._id === statusKey);
    return found ? found.count : 0;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-header" />
        <div className="stats-grid">
          {[1,2,3,4].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
        <div className="skeleton-table" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="page-subtitle">
            Here's an overview of your clinical trials portfolio
          </p>
        </div>
        <Link to="/trials" className="btn-primary">
          + New Trial
        </Link>
      </div>

      {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total */}
        <div className="stat-card stat-card-total">
          <div className="stat-icon-wrap">
            <span className="stat-icon">◈</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalTrials ?? 0}</div>
            <div className="stat-label">Total Trials</div>
          </div>
          <div className="stat-glow" />
        </div>

        {STAT_CARDS.map((card) => (
          <div key={card.key} className={`stat-card stat-card-${card.key.toLowerCase()}`}>
            <div className="stat-icon-wrap">
              <span className="stat-icon">{card.icon}</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{getStatusCount(card.key)}</div>
              <div className="stat-label">{card.label}</div>
            </div>
            <div className="stat-glow" />
          </div>
        ))}
      </div>

      {/* Status Breakdown Chart */}
      {stats?.statusBreakdown?.length > 0 && (
        <div className="glass-card chart-card">
          <h3 className="card-title">Status Breakdown</h3>
          <div className="breakdown-bars">
            {stats.statusBreakdown.map((item) => {
              const pct = stats.totalTrials > 0
                ? Math.round((item.count / stats.totalTrials) * 100)
                : 0;
              return (
                <div key={item._id} className="breakdown-row">
                  <div className="breakdown-label">
                    <StatusBadge status={item._id} size="sm" />
                    <span className="breakdown-count">{item.count}</span>
                  </div>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="breakdown-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Trials Table */}
      <div className="glass-card">
        <div className="card-header-row">
          <h3 className="card-title">Recent Trials</h3>
          <Link to="/trials" className="btn-ghost btn-sm">View All →</Link>
        </div>

        {stats?.recentTrials?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧬</div>
            <p className="empty-title">No trials yet</p>
            <p className="empty-subtitle">Create your first clinical trial to get started</p>
            <Link to="/trials" className="btn-primary">Create Trial</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trial Name</th>
                  <th>Status</th>
                  <th>Phase</th>
                  <th>Start Date</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTrials?.map((trial) => (
                  <tr key={trial._id}>
                    <td>
                      <Link to={`/trials/${trial._id}`} className="trial-name-link">
                        {trial.trialName}
                      </Link>
                    </td>
                    <td><StatusBadge status={trial.status} size="sm" /></td>
                    <td><span className="phase-tag">{trial.phase || 'N/A'}</span></td>
                    <td>{formatDate(trial.startDate)}</td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar avatar-xs">
                          {trial.createdBy?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        {trial.createdBy?.name || 'Unknown'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
