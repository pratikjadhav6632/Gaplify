const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        planType: user.planType,
        premiumExpiry: user.premiumExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        planType: user.planType,
        premiumExpiry: user.premiumExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Forgot Password - send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save hashed OTP and expiry 15 mins
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetPasswordOTP = hashedOtp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send Email using existing email route logic
    const axios = require('axios');
    const HTMLContent = `
      <div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:24px; border-radius:8px;">
        <h2 style="color:#2b8a3e; text-align:center; margin-top:0;">Password Reset Request</h2>
        <p style="font-size:16px; color:#333;">Hello,</p>
        <p style="font-size:16px; color:#333;">We received a request to reset your password. Use the OTP below to proceed:</p>
        <p style="font-size:32px; font-weight:bold; letter-spacing:4px; text-align:center; color:#2b8a3e; margin:16px 0;">${otp}</p>
        <p style="font-size:14px; color:#555;">This OTP is valid for the next <strong>15 minutes</strong>. Please do not share it with anyone.</p>
        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
        <p style="font-size:12px; color:#999;">If you did not request a password reset, please ignore this email or contact our support team.</p>
      </div>
    `;
    try {
      await axios.post(`${process.env.BASE_URL || 'http://localhost:5000'}/api/send-email`, {
        to: email,
        subject: 'Password Reset OTP',
        html: HTMLContent
      });
    } catch (err) {
      console.error('Error sending email via /api/send-email:', err.message);
    }

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating OTP', error: error.message });
  }
});

// Reset Password using OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and newPassword are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update password
    user.password = newPassword; // will be hashed by pre-save hook
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

module.exports = router;