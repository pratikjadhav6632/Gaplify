const axios = require('axios');

const ONE_SIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';

/**
 * Sends a push notification to all subscribed users via OneSignal
 * @param {Object} params
 * @param {string} params.heading - Title of the notification
 * @param {string} params.message - Body of the notification
 * @param {string} [params.url] - URL to open when the notification is clicked
 * @param {Object} [params.data] - Additional data payload
 */
async function sendPushNotification({ heading, message, url, data }) {
  const appId = process.env.ONE_SIGNAL_APP_ID;
  const apiKey = process.env.ONE_SIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    console.warn('OneSignal credentials are missing. Skipping notification.');
    return { skipped: true };
  }

  const payload = {
    app_id: appId,
    included_segments: ['Subscribed Users'],
    headings: { en: heading || 'Gaplify' },
    contents: { en: message },
    url,
    data,
  };

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${apiKey}`,
  };

  const response = await axios.post(ONE_SIGNAL_API_URL, payload, { headers });
  return response.data;
}

module.exports = {
  sendPushNotification,
};


