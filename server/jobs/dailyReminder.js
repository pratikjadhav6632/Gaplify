const cron = require('node-cron');
const { sendPushNotification } = require('../services/notificationService');

const MESSAGES = [
  '🚀 Don’t miss today’s top skills on Gaplify. Check now!',
  '💡 Explore new resources today on Gaplify.',
  '🔥 Upgrade to Premium for unlimited usage.',
  '⏰ Quick 2‑minute browse: fresh picks are live now.',
  '🎯 Your personalized skill picks just updated—take a look.',
  '📈 Trending today: skills hiring managers love. Explore now.',
  '🧠 Learn bite‑sized today, grow full‑sized tomorrow. Start now.',
  '⭐ Keep your learning streak alive—grab one resource.',
  '📚 New resources added to your hub. Check them out.',
  '🧭 Build your roadmap—one step at a time starts today.',
  '💬 Plan your next move with the AI mentor in minutes.',
  '🎓 15 minutes today can change your week. Start learning.',
  '🪄 Continue where you left off—one click away.',
  '🏆 You’re closer than you think. Keep going!',
  '🥇 Top learners are leveling up right now—join in.',
  '📌 Save one resource for later—start with this list.',
  '💡 Tip of the day: small steps compound fast.',
  '🔥 Your next role needs these skills—discover them.',
  '🚀 Premium unlocks unlimited usage—upgrade anytime.',
  '🔔 Your daily learning window is open. Dive in!',
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

