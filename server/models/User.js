const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  proficiency: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  skills: [skillSchema],
  planType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  premiumExpiry: {
    type: Date
  },
  skillAnalysisCount: {
    type: Number,
    default: 0
  },
  roadmapGenCount: {
    type: Number,
    default: 0
  },
  analysisHistory: [
    {
      skills: [skillSchema],
      targetRole: String,
      result: Object,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  roadmapHistory: [
    {
      topic: String,
      level: String,
      duration: String,
      roadmap: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  resetPasswordOTP: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 