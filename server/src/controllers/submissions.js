const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Submission = require('../models/Submission');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
exports.getSubmissions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!submission) {
    return next(
      new ErrorResponse(`No submission found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
  if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this submission`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Create submission
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing submission from the same user within last hour
  const recentSubmission = await Submission.findOne({
    user: req.user.id,
    createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) }
  });

  if (recentSubmission && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You can only make one submission per hour', 400)
    );
  }

  // Upload image to Cloudinary if file exists
  if (req.files) {
    const file = req.files.file;
    
    // Check file type
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Upload image
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'wastewise',
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    req.body.image = result.secure_url;
  }

  const submission = await Submission.create(req.body);

  // Update user's ecoPoints if submission is approved
  if (submission.status === 'approved') {
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { ecoPoints: submission.pointsAwarded }
    });
  }

  res.status(201).json({
    success: true,
    data: submission
  });
});

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private
exports.updateSubmission = asyncHandler(async (req, res, next) => {
  let submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(
      new ErrorResponse(`No submission with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
  if (submission.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this submission`,
        401
      )
    );
  }

  // If admin is approving the submission, update user's ecoPoints
  if (req.body.status === 'approved' && submission.status !== 'approved') {
    await User.findByIdAndUpdate(submission.user, {
      $inc: { ecoPoints: submission.pointsAwarded }
    });
  }

  submission = await Submission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
exports.deleteSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(
      new ErrorResponse(`No submission with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
  if (submission.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this submission`,
        401
      )
    );
  }

  // If submission was approved, deduct points
  if (submission.status === 'approved') {
    await User.findByIdAndUpdate(submission.user, {
      $inc: { ecoPoints: -submission.pointsAwarded }
    });
  }

  await submission.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get submissions by user
// @route   GET /api/submissions/user/:userId
// @access  Private
exports.getUserSubmissions = asyncHandler(async (req, res, next) => {
  if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to view these submissions', 401)
    );
  }

  const submissions = await Submission.find({ user: req.params.userId });

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});
