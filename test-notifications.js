#!/usr/bin/env node

/**
 * Test script for notification system
 * Run this to verify your setup is working
 */

const axios = require('axios');

const SERVER_URL = process.env.APP_URL || 'https://gaplify.onrender.com';
const CRON_SECRET = process.env.CRON_SECRET_KEY;

async function runTests() {
  console.log('🧪 Testing Notification System\n');
  
  // Test 1: Server Ping
  console.log('1. Testing server ping...');
  try {
    const pingResponse = await axios.get(`${SERVER_URL}/ping`);
    console.log('✅ Server is alive:', pingResponse.data);
  } catch (error) {
    console.log('❌ Server ping failed:', error.message);
    return;
  }
  
  // Test 2: Health Check
  console.log('\n2. Testing health check...');
  try {
    const healthResponse = await axios.get(`${SERVER_URL}/api/cron/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    if (!healthResponse.data.oneSignalConfigured) {
      console.log('⚠️  OneSignal credentials not configured');
    }
    if (!healthResponse.data.cronSecretConfigured) {
      console.log('⚠️  Cron secret not configured');
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 3: Manual Notification (if secret is available)
  if (CRON_SECRET) {
    console.log('\n3. Testing manual notification...');
    try {
      const notifyResponse = await axios.get(`${SERVER_URL}/api/cron/trigger-notification?key=${CRON_SECRET}`);
      console.log('✅ Manual notification sent:', notifyResponse.data);
    } catch (error) {
      console.log('❌ Manual notification failed:', error.response?.data || error.message);
    }
  } else {
    console.log('\n3. Skipping manual notification test (CRON_SECRET_KEY not set)');
  }
  
  console.log('\n📋 Summary:');
  console.log('- Server URL:', SERVER_URL);
  console.log('- Cron Secret configured:', !!CRON_SECRET);
  console.log('- Test completed at:', new Date().toISOString());
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
