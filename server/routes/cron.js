const express = require('express');
const router = express.Router();
const { sendPushNotification } = require('../services/notificationService');
const MESSAGES = require('../jobs/dailyReminder').MESSAGES;

// Endpoint to trigger notifications manually (protected by secret key)
router.get('/trigger-notification', async (req, res) => {
  const { key } = req.query;
  
  // Simple security check - make sure to set this in your environment variables
  if (key !== process.env.CRON_SECRET_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    await sendPushNotification({
      heading: 'Gaplify',
      message,
      url: process.env.APP_PUBLIC_URL || 'https://www.gaplify.in',
      data: { category: 'scheduled_reminder' }
    });
    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

module.exports = router;
