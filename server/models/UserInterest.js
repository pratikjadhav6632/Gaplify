const mongoose = require('mongoose');

const userInterestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resources: [{
    resourceId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    category: String,
    image: String,
    link: String,
    rating: Number,
    savedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('UserInterest', userInterestSchema); 