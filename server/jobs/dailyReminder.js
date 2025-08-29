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
 * - 10:00, 13:00, 16:00, 19:00, 21:00 IST → 04:30, 07:30, 10:30, 13:30, 15:30 UTC.
 * - Additional slot 19:15 IST → 13:45 UTC.
 */
function scheduleDailyReminder() {
  // Minute 30 of hours 4,7,10,13,15 UTC every day
  cron.schedule('30 4,7,10,13,15 * * *', async () => {
    try {
      await sendDailyReminderNow();
    } catch (error) {
      console.error('Failed to send daily reminder:', error?.response?.data || error.message);
    }
  }, { timezone: 'UTC' });

  // Additional run at 13:45 UTC (19:15 IST)
  cron.schedule('45 13 * * *', async () => {
    try {
      await sendDailyReminderNow();
    } catch (error) {
      console.error('Failed to send daily reminder (19:15 IST):', error?.response?.data || error.message);
    }
  }, { timezone: 'UTC' });
}

module.exports = {
  scheduleDailyReminder,
};

