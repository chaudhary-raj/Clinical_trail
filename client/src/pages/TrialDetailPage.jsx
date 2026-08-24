import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import StatusBadge from '../components/StatusBadge';
import TrialModal from '../components/TrialModal';

const TrialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTrial = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/trials/${id}`);
        setTrial(res.data.data.trial);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Trial not found.' : 'Failed to load trial.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrial();
  }, [id]);

  const handleUpdate = async (formData) => {
    setEditLoading(true);
    try {
      const res = await axiosInstance.put(`/trials/${id}`, formData);
      setTrial(res.data.data.trial);
      setEditOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/trials/${id}`);
      navigate('/trials', { replace: true });
    } catch {
      setError('Failed to delete trial.');
      setDeleteLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const durationDays = trial
    ? Math.ceil((new Date(trial.endDate) - new Date(trial.startDate)) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) return (
    <div className="page-container">
      <div className="skeleton-header" style={{ maxWidth: 400 }} />
      <div className="skeleton-card" style={{ height: 400 }} />
    </div>
  );

  if (error && !trial) return (
    <div className="page-container">
      <div className="alert alert-error"><span>⚠</span> {error}</div>
      <Link to="/trials" className="btn-ghost">← Back to Trials</Link>
    </div>
  );

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/trials" className="breadcrumb-link">Trials</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{trial?.trialName}</span>
      </div>

      {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

      {/* Header Card */}
      <div className="glass-card detail-header-card">
        <div className="detail-header-top">
          <div>
            <div className="detail-badges">
              <StatusBadge status={trial.status} />
              <span className="phase-tag phase-tag-lg">{trial.phase || 'N/A'}</span>
            </div>
            <h1 className="detail-title">{trial.trialName}</h1>
          </div>
          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => setEditOpen(true)} id="edit-trial-btn">
              ✎ Edit
            </button>
            <button className="btn-danger" onClick={() => setDeleteConfirm(true)} id="delete-trial-btn">
              ✕ Delete
            </button>
          </div>
        </div>

        <p className="detail-description">{trial.description}</p>

        {/* Key Metrics */}
        <div className="detail-metrics">
          <div className="metric-item">
            <span className="metric-icon">📅</span>
            <div>
              <div className="metric-label">Start Date</div>
              <div className="metric-value">{formatDate(trial.startDate)}</div>
            </div>
          </div>
          <div className="metric-item">
            <span className="metric-icon">🏁</span>
            <div>
              <div className="metric-label">End Date</div>
              <div className="metric-value">{formatDate(trial.endDate)}</div>
            </div>
          </div>
          <div className="metric-item">
            <span className="metric-icon">⏱</span>
            <div>
              <div className="metric-label">Duration</div>
              <div className="metric-value">{durationDays} days</div>
            </div>
          </div>
          <div className="metric-item">
            <span className="metric-icon">👥</span>
            <div>
              <div className="metric-label">Participants</div>
              <div className="metric-value">{trial.participantCount?.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="detail-grid">
        <div className="glass-card detail-info-card">
          <h3 className="card-title">Trial Information</h3>
          <dl className="info-list">
            <div className="info-row">
              <dt>Sponsor</dt>
              <dd>{trial.sponsor || <span className="muted">—</span>}</dd>
            </div>
            <div className="info-row">
              <dt>Principal Investigator</dt>
              <dd>{trial.principalInvestigator || <span className="muted">—</span>}</dd>
            </div>
            <div className="info-row">
              <dt>Phase</dt>
              <dd>{trial.phase || 'N/A'}</dd>
            </div>
            <div className="info-row">
              <dt>Status</dt>
              <dd><StatusBadge status={trial.status} size="sm" /></dd>
            </div>
          </dl>
        </div>

        <div className="glass-card detail-info-card">
          <h3 className="card-title">Record Info</h3>
          <dl className="info-list">
            <div className="info-row">
              <dt>Created By</dt>
              <dd>
                <div className="user-cell">
                  <div className="avatar avatar-xs">
                    {trial.createdBy?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  {trial.createdBy?.name || 'Unknown'}
                </div>
              </dd>
            </div>
            <div className="info-row">
              <dt>Created</dt>
              <dd>{formatDate(trial.createdAt)}</dd>
            </div>
            <div className="info-row">
              <dt>Last Updated</dt>
              <dd>{formatDate(trial.updatedAt)}</dd>
            </div>
            <div className="info-row">
              <dt>Trial ID</dt>
              <dd><code className="mono">{trial._id}</code></dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Edit Modal */}
      <TrialModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        editData={trial}
        loading={editLoading}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Delete Trial?</h3>
            <p className="confirm-body">
              Are you sure you want to delete <strong>"{trial.trialName}"</strong>?
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(false)} disabled={deleteLoading}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
                id="confirm-delete-detail-btn"
              >
                {deleteLoading ? <><span className="btn-spinner" /> Deleting...</> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrialDetailPage;
