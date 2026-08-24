import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';

const STATUSES = ['Pending', 'Recruiting', 'Active', 'Completed', 'Suspended', 'Terminated'];
const PHASES = ['N/A', 'Phase I', 'Phase II', 'Phase III', 'Phase IV'];

const DEFAULT_FORM = {
  trialName: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'Pending',
  phase: 'N/A',
  sponsor: '',
  principalInvestigator: '',
  participantCount: 0,
};

const TrialModal = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editData);

  // Populate form for editing
  useEffect(() => {
    if (isOpen && editData) {
      setForm({
        trialName: editData.trialName || '',
        description: editData.description || '',
        startDate: editData.startDate ? editData.startDate.split('T')[0] : '',
        endDate: editData.endDate ? editData.endDate.split('T')[0] : '',
        status: editData.status || 'Pending',
        phase: editData.phase || 'N/A',
        sponsor: editData.sponsor || '',
        principalInvestigator: editData.principalInvestigator || '',
        participantCount: editData.participantCount || 0,
      });
    } else if (isOpen) {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [isOpen, editData]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const validate = () => {
    const newErrors = {};
    if (!form.trialName.trim()) newErrors.trialName = 'Trial name is required';
    else if (form.trialName.trim().length < 3) newErrors.trialName = 'Minimum 3 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    else if (form.description.trim().length < 10) newErrors.description = 'Minimum 10 characters';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate) newErrors.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (form.participantCount < 0) newErrors.participantCount = 'Cannot be negative';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ ...form, participantCount: Number(form.participantCount) });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? '✎ Edit Clinical Trial' : '+ New Clinical Trial'}
            </h2>
            <p className="modal-subtitle">
              {isEditing ? 'Update the details of this trial' : 'Fill in the details to create a new clinical trial'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Trial Name */}
            <div className="form-group full-width">
              <label className="form-label">Trial Name <span className="required">*</span></label>
              <input
                type="text"
                name="trialName"
                value={form.trialName}
                onChange={handleChange}
                placeholder="e.g. Phase III BRCA1 Inhibitor Study"
                className={`form-input ${errors.trialName ? 'error' : ''}`}
                maxLength={150}
              />
              {errors.trialName && <span className="field-error">{errors.trialName}</span>}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the purpose, methodology, and objectives of the trial..."
                rows={4}
                className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                maxLength={2000}
              />
              <div className="char-count">{form.description.length}/2000</div>
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label">Start Date <span className="required">*</span></label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={`form-input ${errors.startDate ? 'error' : ''}`}
              />
              {errors.startDate && <span className="field-error">{errors.startDate}</span>}
            </div>

            {/* End Date */}
            <div className="form-group">
              <label className="form-label">End Date <span className="required">*</span></label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || ''}
                className={`form-input ${errors.endDate ? 'error' : ''}`}
              />
              {errors.endDate && <span className="field-error">{errors.endDate}</span>}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input form-select">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="status-preview"><StatusBadge status={form.status} size="sm" /></div>
            </div>

            {/* Phase */}
            <div className="form-group">
              <label className="form-label">Phase</label>
              <select name="phase" value={form.phase} onChange={handleChange} className="form-input form-select">
                {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Sponsor */}
            <div className="form-group">
              <label className="form-label">Sponsor</label>
              <input
                type="text"
                name="sponsor"
                value={form.sponsor}
                onChange={handleChange}
                placeholder="e.g. NIH, Pfizer Inc."
                className="form-input"
                maxLength={100}
              />
            </div>

            {/* Principal Investigator */}
            <div className="form-group">
              <label className="form-label">Principal Investigator</label>
              <input
                type="text"
                name="principalInvestigator"
                value={form.principalInvestigator}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
                className="form-input"
                maxLength={100}
              />
            </div>

            {/* Participant Count */}
            <div className="form-group">
              <label className="form-label">Participant Count</label>
              <input
                type="number"
                name="participantCount"
                value={form.participantCount}
                onChange={handleChange}
                min={0}
                className={`form-input ${errors.participantCount ? 'error' : ''}`}
              />
              {errors.participantCount && <span className="field-error">{errors.participantCount}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" /> {isEditing ? 'Saving...' : 'Creating...'}</>
              ) : (
                isEditing ? '✓ Save Changes' : '+ Create Trial'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrialModal;
