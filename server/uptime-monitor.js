/**
 * Simple uptime monitoring script
 * This can be used with UptimeRobot or similar services
 * to keep the Render server alive and trigger notifications
 */

const axios = require('axios');

const SERVER_URL = process.env.APP_URL || 'https://gaplify.onrender.com';
const CRON_SECRET = process.env.CRON_SECRET_KEY;

async function pingServer() {
  try {
    console.log(`[${new Date().toISOString()}] Pinging server: ${SERVER_URL}`);
    const response = await axios.get(`${SERVER_URL}/ping`);
    console.log('Server ping successful:', response.data);
    return true;
  } catch (error) {
    console.error('Server ping failed:', error.message);
    return false;
  }
}

async function triggerNotification() {
  if (!CRON_SECRET) {
    console.error('CRON_SECRET_KEY not configured');
    return false;
  }

  try {
    console.log(`[${new Date().toISOString()}] Triggering notification...`);
    const response = await axios.get(`${SERVER_URL}/api/cron/trigger-notification?key=${CRON_SECRET}`);
    console.log('Notification triggered successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Notification trigger failed:', error.response?.data || error.message);
    return false;
  }
}

async function checkHealth() {
  try {
    console.log(`[${new Date().toISOString()}] Checking server health...`);
    const response = await axios.get(`${SERVER_URL}/api/cron/health`);
    console.log('Health check successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.response?.data || error.message);
    return null;
  }
}

// If this script is run directly
if (require.main === module) {
  const action = process.argv[2];
  
  switch (action) {
    case 'ping':
      pingServer();
      break;
    case 'notify':
      triggerNotification();
      break;
    case 'health':
      checkHealth();
      break;
    default:
      console.log('Usage: node uptime-monitor.js [ping|notify|health]');
      console.log('  ping   - Ping the server to keep it alive');
      console.log('  notify - Trigger a notification manually');
      console.log('  health - Check server health status');
  }
}

module.exports = {
  pingServer,
  triggerNotification,
  checkHealth
};
