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
  const message = getRandomMessage();
  await sendPushNotification({
    heading: 'Gaplify',
    message,
    url: process.env.APP_PUBLIC_URL || 'https://www.gaplify.in',
    data: { category: 'daily_reminder' },
  });
  console.log(`[OneSignal] Reminder sent: ${message}`);
}

/**
 * Schedule cron jobs to send reminders per day at:
 * - 8:00, 10:30, 12:30, 15:00, 19:30, 20:15, 22:00 IST
 * - 2:30, 5:00, 7:00, 9:30, 14:00, 14:45, 16:30 UTC
 */
function scheduleDailyReminder() {
  // :00 and :30 times (2:30, 5:00, 7:00, 9:30, 14:00, 16:30 UTC)
  cron.schedule('30 2,14 * * *', async () => {  // 8:00 AM and 7:30 PM IST
    await sendScheduledNotification('8:00 AM');
  }, { timezone: 'UTC' });
  
  cron.schedule('0 5,7,9,16 * * *', async () => {  // 10:30 AM, 12:30 PM, 3:00 PM, 10:00 PM IST
    await sendScheduledNotification();
  }, { timezone: 'UTC' });
  
  cron.schedule('45 14 * * *', async () => {  // 8:15 PM IST
    await sendScheduledNotification('8:15 PM');
  }, { timezone: 'UTC' });
  
  // Helper function to handle notification sending with error handling
  async function sendScheduledNotification(time = '') {
    try {
      await sendDailyReminderNow();
      console.log(`[${new Date().toISOString()}] Notification sent successfully${time ? ' at ' + time : ''}`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Failed to send daily reminder${time ? ' at ' + time : ''}:`, error?.response?.data || error.message);
    }
  }
}

module.exports = {
  scheduleDailyReminder,
};

