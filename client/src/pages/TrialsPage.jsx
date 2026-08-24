import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import StatusBadge from '../components/StatusBadge';
import TrialModal from '../components/TrialModal';

const STATUSES = ['All', 'Pending', 'Recruiting', 'Active', 'Completed', 'Suspended', 'Terminated'];

const TrialsPage = () => {
  const [trials, setTrials] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState(null);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTrials = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, status: statusFilter };
      if (search) params.search = search;
      const res = await axiosInstance.get('/trials', { params });
      setTrials(res.data.data.trials);
      setPagination(res.data.data.pagination);
    } catch {
      setError('Failed to load trials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchTrials(); }, [fetchTrials]);

  // Clear success after 3s
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openCreate = () => { setEditingTrial(null); setModalOpen(true); };
  const openEdit = (trial) => { setEditingTrial(trial); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTrial(null); };

  const handleSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingTrial) {
        await axiosInstance.put(`/trials/${editingTrial._id}`, formData);
        setSuccess('Trial updated successfully!');
      } else {
        await axiosInstance.post('/trials', formData);
        setSuccess('Trial created successfully!');
      }
      closeModal();
      fetchTrials();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/trials/${id}`);
      setDeleteConfirm(null);
      setSuccess('Trial deleted successfully!');
      fetchTrials();
    } catch {
      setError('Failed to delete trial.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—';

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Clinical Trials</h1>
          <p className="page-subtitle">
            {pagination.totalItems ?? 0} trial{pagination.totalItems !== 1 ? 's' : ''} total
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate} id="create-trial-btn">
          + New Trial
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error"><span>⚠</span> {error} <button onClick={() => setError('')}>✕</button></div>}
      {success && <div className="alert alert-success"><span>✓</span> {success}</div>}

      {/* Filters */}
      <div className="filters-bar glass-card">
        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search trials by name or description..."
              className="form-input search-input"
              id="trial-search"
            />
          </div>
          <button type="submit" className="btn-secondary">Search</button>
          {(search || searchInput) && (
            <button type="button" className="btn-ghost" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>
              Clear
            </button>
          )}
        </form>

        {/* Status Filter Tabs */}
        <div className="filter-tabs">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card">
        {loading ? (
          <div className="table-loading">
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton-row" />)}
          </div>
        ) : trials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔬</div>
            <p className="empty-title">No trials found</p>
            <p className="empty-subtitle">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'Create your first clinical trial to get started'}
            </p>
            {!search && statusFilter === 'All' && (
              <button className="btn-primary" onClick={openCreate}>Create Trial</button>
            )}
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
                  <th>End Date</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trials.map((trial) => (
                  <tr key={trial._id} className="table-row-hover">
                    <td>
                      <div className="trial-name-cell">
                        <span className="trial-name">{trial.trialName}</span>
                        {trial.sponsor && <span className="trial-sponsor">{trial.sponsor}</span>}
                      </div>
                    </td>
                    <td><StatusBadge status={trial.status} size="sm" /></td>
                    <td><span className="phase-tag">{trial.phase || 'N/A'}</span></td>
                    <td>{formatDate(trial.startDate)}</td>
                    <td>{formatDate(trial.endDate)}</td>
                    <td>
                      <span className="participant-count">
                        {trial.participantCount?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn edit"
                          onClick={() => openEdit(trial)}
                          title="Edit trial"
                          id={`edit-${trial._id}`}
                        >
                          ✎
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => setDeleteConfirm(trial)}
                          title="Delete trial"
                          id={`delete-${trial._id}`}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn-ghost btn-sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!pagination.hasPrevPage}
            >
              ← Prev
            </button>
            <div className="page-numbers">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-num ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="btn-ghost btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Trial Modal */}
      <TrialModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editingTrial}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Delete Trial?</h3>
            <p className="confirm-body">
              Are you sure you want to delete{' '}
              <strong>"{deleteConfirm.trialName}"</strong>?
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={actionLoading}
                id="confirm-delete-btn"
              >
                {actionLoading ? <><span className="btn-spinner" /> Deleting...</> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrialsPage;
