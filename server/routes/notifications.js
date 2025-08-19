const express = require('express');
const router = express.Router();
const { sendPushNotification } = require('../services/notificationService');

// POST /api/notifications/send
// Body: { heading?: string, message: string, url?: string, data?: object }
router.post('/notifications/send', async (req, res) => {
  try {
    const { heading, message, url, data } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    const result = await sendPushNotification({ heading, message, url, data });
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending notification:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;


