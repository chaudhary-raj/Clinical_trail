const mongoose = require('mongoose');

const TRIAL_STATUSES = ['Recruiting', 'Active', 'Completed', 'Suspended', 'Terminated', 'Pending'];

const TrialSchema = new mongoose.Schema(
  {
    trialName: {
      type: String,
      required: [true, 'Trial name is required'],
      trim: true,
      minlength: [3, 'Trial name must be at least 3 characters'],
      maxlength: [150, 'Trial name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: {
        values: TRIAL_STATUSES,
        message: `Status must be one of: ${TRIAL_STATUSES.join(', ')}`,
      },
      default: 'Pending',
    },
    phase: {
      type: String,
      enum: ['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'N/A'],
      default: 'N/A',
    },
    sponsor: {
      type: String,
      trim: true,
      maxlength: [100, 'Sponsor name cannot exceed 100 characters'],
      default: '',
    },
    principalInvestigator: {
      type: String,
      trim: true,
      maxlength: [100, 'Principal investigator name cannot exceed 100 characters'],
      default: '',
    },
    participantCount: {
      type: Number,
      min: [0, 'Participant count cannot be negative'],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: duration in days ───────────────────────────
TrialSchema.virtual('durationDays').get(function () {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// ─── Indexes for query performance ───────────────────────
TrialSchema.index({ status: 1 });
TrialSchema.index({ createdBy: 1 });
TrialSchema.index({ trialName: 'text', description: 'text' }); // full-text search

module.exports = mongoose.model('Trial', TrialSchema);
module.exports.TRIAL_STATUSES = TRIAL_STATUSES;
