const express = require('express');
const router = express.Router();
const { sendDailyReminderNow } = require('../jobs/dailyReminder');

// Endpoint to trigger notifications manually (protected by secret key)
router.get('/trigger-notification', async (req, res) => {
  const { key } = req.query;
  
  // Simple security check - make sure to set this in your environment variables
  if (key !== process.env.CRON_SECRET_KEY) {
    console.warn(`[Cron] Unauthorized access attempt with key: ${key ? 'provided' : 'missing'}`);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Manual notification trigger requested`);
    const result = await sendDailyReminderNow();
    
    if (result.error) {
      console.error('[Cron] Manual notification failed:', result.error);
      return res.status(500).json({ 
        error: 'Failed to send notification', 
        details: result.error 
      });
    }
    
    console.log('[Cron] Manual notification sent successfully');
    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Cron] Exception in manual notification:', error);
    res.status(500).json({ 
      error: 'Failed to send notification', 
      details: error.message 
    });
  }
});

// Health check endpoint for cron service
router.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    oneSignalConfigured: !!(process.env.ONE_SIGNAL_APP_ID && process.env.ONE_SIGNAL_REST_API_KEY),
    cronSecretConfigured: !!process.env.CRON_SECRET_KEY
  };
  
  console.log('[Cron] Health check requested:', health);
  res.json(health);
});

module.exports = router;
