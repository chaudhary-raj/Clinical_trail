const { validationResult } = require('express-validator');
const Trial = require('../models/Trial');

// ─── @route  GET /api/trials ──────────────────────────────
// @desc  Get all trials with pagination, search, and filtering
// @access Private
const getTrials = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const query = {};

  // Status filter
  if (status && status !== 'All') {
    query.status = status;
  }

  // Full-text search
  if (search && search.trim()) {
    query.$text = { $search: search.trim() };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === 'asc' ? 1 : -1;

  const [trials, total] = await Promise.all([
    Trial.find(query)
      .populate('createdBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Trial.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      trials,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    },
  });
};

// ─── @route  POST /api/trials ─────────────────────────────
// @desc  Create a new clinical trial
// @access Private
const createTrial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const {
    trialName,
    description,
    startDate,
    endDate,
    status,
    phase,
    sponsor,
    principalInvestigator,
    participantCount,
  } = req.body;

  const trial = await Trial.create({
    trialName,
    description,
    startDate,
    endDate,
    status,
    phase,
    sponsor,
    principalInvestigator,
    participantCount,
    createdBy: req.user.id,
  });

  const populated = await trial.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Clinical trial created successfully',
    data: { trial: populated },
  });
};

// ─── @route  GET /api/trials/:id ──────────────────────────
// @desc  Get single trial by ID
// @access Private
const getTrialById = async (req, res) => {
  const trial = await Trial.findById(req.params.id).populate('createdBy', 'name email');

  if (!trial) {
    return res.status(404).json({
      success: false,
      message: 'Clinical trial not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { trial },
  });
};

// ─── @route  PUT /api/trials/:id ──────────────────────────
// @desc  Update a clinical trial
// @access Private
const updateTrial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const trial = await Trial.findById(req.params.id);

  if (!trial) {
    return res.status(404).json({
      success: false,
      message: 'Clinical trial not found',
    });
  }

  const {
    trialName,
    description,
    startDate,
    endDate,
    status,
    phase,
    sponsor,
    principalInvestigator,
    participantCount,
  } = req.body;

  const updated = await Trial.findByIdAndUpdate(
    req.params.id,
    {
      trialName,
      description,
      startDate,
      endDate,
      status,
      phase,
      sponsor,
      principalInvestigator,
      participantCount,
    },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Clinical trial updated successfully',
    data: { trial: updated },
  });
};

// ─── @route  DELETE /api/trials/:id ───────────────────────
// @desc  Delete a clinical trial
// @access Private
const deleteTrial = async (req, res) => {
  const trial = await Trial.findById(req.params.id);

  if (!trial) {
    return res.status(404).json({
      success: false,
      message: 'Clinical trial not found',
    });
  }

  await Trial.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Clinical trial deleted successfully',
    data: { id: req.params.id },
  });
};

// ─── @route  GET /api/trials/stats ────────────────────────
// @desc  Get aggregate stats for dashboard
// @access Private
const getStats = async (req, res) => {
  const stats = await Trial.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalParticipants: { $sum: '$participantCount' },
      },
    },
  ]);

  const totalTrials = await Trial.countDocuments();
  const recentTrials = await Trial.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('createdBy', 'name')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      statusBreakdown: stats,
      totalTrials,
      recentTrials,
    },
  });
};

module.exports = { getTrials, createTrial, getTrialById, updateTrial, deleteTrial, getStats };
