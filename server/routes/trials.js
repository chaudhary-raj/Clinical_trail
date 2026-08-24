const express = require('express');
const { body } = require('express-validator');
const {
  getTrials,
  createTrial,
  getTrialById,
  updateTrial,
  deleteTrial,
  getStats,
} = require('../controllers/trialController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Validation rules ─────────────────────────────────────
const trialValidation = [
  body('trialName')
    .trim()
    .notEmpty().withMessage('Trial name is required')
    .isLength({ min: 3, max: 150 }).withMessage('Trial name must be 3–150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10–2000 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['Recruiting', 'Active', 'Completed', 'Suspended', 'Terminated', 'Pending'])
    .withMessage('Invalid status value'),
  body('participantCount')
    .optional()
    .isInt({ min: 0 }).withMessage('Participant count must be a non-negative integer'),
];

// ─── All routes require authentication ───────────────────
router.use(protect);

// ─── Routes ───────────────────────────────────────────────
router.get('/stats', getStats);
router.get('/', getTrials);
router.post('/', trialValidation, createTrial);
router.get('/:id', getTrialById);
router.put('/:id', trialValidation, updateTrial);
router.delete('/:id', deleteTrial);

module.exports = router;
