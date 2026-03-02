const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  wasteType: {
    type: String,
    required: [true, 'Please specify the waste type'],
    enum: ['dry', 'wet', 'e-waste', 'hazardous', 'other']
  },
  pointsAwarded: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  feedback: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add geospatial index for location-based queries
SubmissionSchema.index({ location: '2dsphere' });

// Calculate points based on waste type
SubmissionSchema.pre('save', function(next) {
  const pointsMap = {
    'dry': 10,
    'wet': 5,
    'e-waste': 20,
    'hazardous': 30,
    'other': 5
  };
  
  this.pointsAwarded = pointsMap[this.wasteType] || 5;
  next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
