const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// TODO: Add your Razorpay key_id and key_secret in environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Warn if env vars are missing
if (!(process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID) || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay environment variables: RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET');
}


// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    console.log('Attempting to create Razorpay order...');
    const options = {
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// Verify payment and upgrade user
router.post('/verify', auth, async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + '|' + payment_id)
      .digest('hex');
    if (generated_signature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
    // Mark user as premium
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.planType = 'premium';
    // Set expiry to 1 month from now
    user.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    user.skillAnalysisCount = 0;
    user.roadmapGenCount = 0;
    await user.save();
    res.json({ success: true, message: 'Payment verified, user upgraded to premium' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
});

module.exports = router; 