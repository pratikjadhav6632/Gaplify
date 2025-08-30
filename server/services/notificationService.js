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

  try {
    const response = await axios.post(ONE_SIGNAL_API_URL, payload, { headers });
    console.log('OneSignal API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('OneSignal API Error:', error.response?.data || error.message);
    
    // If no subscribed users, try with "All" segment
    if (error.response?.data?.errors?.includes('All included players are not subscribed')) {
      console.log('No subscribed users found. Trying with "All" segment...');
      const fallbackPayload = {
        ...payload,
        included_segments: ['All']
      };
      
      try {
        const fallbackResponse = await axios.post(ONE_SIGNAL_API_URL, fallbackPayload, { headers });
        console.log('OneSignal Fallback Response:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('OneSignal Fallback Error:', fallbackError.response?.data || fallbackError.message);
        return { error: fallbackError.response?.data || fallbackError.message };
      }
    }
    
    return { error: error.response?.data || error.message };
  }
}

module.exports = {
  sendPushNotification,
};


