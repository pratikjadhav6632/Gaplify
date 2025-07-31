const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Reuse transporter config from email.js if available
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/*
  @route   POST /api/feedback
  @desc    Send feedback to site administrator email
  @body    { name, email, subject, message }
*/
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, subject, message) are required',
      });
    }

    const transporter = getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_RECEIVER || process.env.EMAIL_USER,
      subject: `Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px; border-radius:8px;">
          <h2 style="color:#2563eb;">📬 New Feedback Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="margin-top:16px; white-space:pre-wrap;">${message}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Feedback sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send feedback',
      error: error.message,
    });
  }
});

module.exports = router;
