const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getUserSubmissions
} = require('../controllers/submissions');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Submission = require('../models/Submission');

// Include other resource routers
const submissionRouter = require('./submissions');

// Re-route into other resource routers
// router.use('/:submissionId/feedback', submissionRouter);

router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(Submission, {
      path: 'user',
      select: 'name email'
    }),
    getSubmissions
  )
  .post(protect, createSubmission);

router
  .route('/:id')
  .get(protect, getSubmission)
  .put(protect, updateSubmission)
  .delete(protect, deleteSubmission);

router.route('/user/:userId').get(protect, getUserSubmissions);

module.exports = router;
