const cron = require('node-cron');
const { sendPushNotification } = require('../services/notificationService');

const MESSAGES = [
  '🚀 Flash Alert! Your skill boost is ready! 3x learning points active for 1 hour!',
  '🔥 Hot Picks for You! 5 new resources just dropped in your feed!',
  '⏰ Only 2 hours left! Your daily learning streak is about to reset!',
  '🎁 Surprise! You unlocked a special learning path! Open now to claim!',
  '📈 Trending Now: The top 3 skills in your field! Tap to see!',
  `👑 You're in the top 10% of learners this week! Keep it up!`,
  '💎 Exclusive: Limited-time 50% off Premium! Upgrade now!',
  '🚨 New! AI-powered career coach is ready for your session!',
  `🏆 Challenge Alert! Complete today's mission for bonus rewards!`,
  '✨ Just In: Personalize your learning with our new AI assistant!',
  `🎯 You're 1 skill away from unlocking Expert level! Keep going!`,
  '💡 Pro Tip: Morning learners are 3x more successful! Start now!',
  '🤖 Your AI mentor found 5 perfect resources for you!',
  '📱 Quick! Your daily 5-minute learning window is open!',
  '🌟 Special: First 100 learners today get free certification!',
  '⚡ Energy Boost! Your focus time starts now - learn with 2x speed!',
  `🎉 You're doing amazing! Here are your weekly stats!`,
  '🔔 Ding! Your personalized learning digest is ready!',
  '💼 Hiring Alert! These skills are in hot demand! Learn now!',
  '🏅 New Badge Unlocked! Check your achievements!',
];

let lastMessageIndex = -1;
function getRandomMessage() {
  if (MESSAGES.length === 0) return '💡 Explore new skills today on Gaplify.';
  if (MESSAGES.length === 1) return MESSAGES[0];
  let index = Math.floor(Math.random() * MESSAGES.length);
  if (index === lastMessageIndex) {
    index = (index + 1) % MESSAGES.length;
  }
  lastMessageIndex = index;
  return MESSAGES[index];
}

async function sendDailyReminderNow() {
  console.log(`[${new Date().toISOString()}] Starting daily reminder notification...`);
  
  // Check if OneSignal credentials are available
  if (!process.env.ONE_SIGNAL_APP_ID || !process.env.ONE_SIGNAL_REST_API_KEY) {
    console.error('[OneSignal] Missing credentials: ONE_SIGNAL_APP_ID or ONE_SIGNAL_REST_API_KEY');
    return { error: 'Missing OneSignal credentials' };
  }

  const message = getRandomMessage();
  try {
    const result = await sendPushNotification({
      heading: 'Gaplify',
      message,
      url: process.env.APP_PUBLIC_URL || 'https://www.gaplify.in',
      data: { category: 'daily_reminder' },
    });
    
    if (result.error) {
      console.error(`[OneSignal] Failed to send reminder: ${result.error}`);
      return result;
    }
    
    console.log(`[OneSignal] Reminder sent successfully: ${message}`);
    console.log(`[OneSignal] Response:`, result);
    return result;
  } catch (error) {
    console.error(`[OneSignal] Exception sending reminder:`, error);
    return { error: error.message };
  }
}

/**
 * Schedule cron jobs to send reminders per day at:
 * - 8:00, 10:30, 12:30, 15:00, 19:30, 20:15, 22:00 IST
 * - 2:30, 5:00, 7:00, 9:30, 14:00, 14:45, 16:30 UTC
 */
function scheduleDailyReminder() {
  console.log(`[${new Date().toISOString()}] Setting up daily reminder cron jobs...`);
  
  // Check if we're in a serverless environment
  if (process.env.VERCEL) {
    console.log('[Cron] Skipping cron setup in serverless environment');
    return;
  }

  // :00 and :30 times (2:30, 5:00, 7:00, 9:30, 14:00, 16:30 UTC)
  cron.schedule('30 2,14 * * *', async () => {  // 8:00 AM and 7:30 PM IST
    console.log(`[${new Date().toISOString()}] Cron triggered: 8:00 AM / 7:30 PM IST`);
    await sendScheduledNotification('8:00 AM / 7:30 PM IST');
  }, { timezone: 'UTC' });
  
  cron.schedule('0 5,7,9,16 * * *', async () => {  // 10:30 AM, 12:30 PM, 3:00 PM, 10:00 PM IST
    console.log(`[${new Date().toISOString()}] Cron triggered: 10:30 AM, 12:30 PM, 3:00 PM, 10:00 PM IST`);
    await sendScheduledNotification('10:30 AM, 12:30 PM, 3:00 PM, 10:00 PM IST');
  }, { timezone: 'UTC' });
  
  cron.schedule('45 14 * * *', async () => {  // 8:15 PM IST
    console.log(`[${new Date().toISOString()}] Cron triggered: 8:15 PM IST`);
    await sendScheduledNotification('8:15 PM IST');
  }, { timezone: 'UTC' });
  
  console.log('[Cron] Daily reminder cron jobs scheduled successfully');
  
  // Helper function to handle notification sending with error handling
  async function sendScheduledNotification(time = '') {
    try {
      const result = await sendDailyReminderNow();
      if (result.error) {
        console.error(`[${new Date().toISOString()}] Failed to send daily reminder${time ? ' at ' + time : ''}:`, result.error);
      } else {
        console.log(`[${new Date().toISOString()}] Notification sent successfully${time ? ' at ' + time : ''}`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Exception in scheduled notification${time ? ' at ' + time : ''}:`, error);
    }
  }
}

module.exports = {
  scheduleDailyReminder,
  sendDailyReminderNow,
  MESSAGES,
};

