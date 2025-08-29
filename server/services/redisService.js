const Redis = require('ioredis');

// Initialize Redis connection with Upstash URL
const redis = new Redis('rediss://default:ASJcAAImcDFjYTE4ODA5MzBiZGQ0NDRmYTAxZGVhODU5NzAwYjg1Y3AxODc5Ng@trusting-pig-8796.upstash.io:6379', {
  tls: {
    rejectUnauthorized: false // Required for Upstash
  },
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Simple health check function
const checkRedisHealth = async () => {
  try {
    // Simple ping to check connection
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

// Function to keep the connection alive
const keepAlive = async () => {
  try {
    await redis.set('keepalive', Date.now(), 'EX', 60); // Set key with 60s expiry
  } catch (error) {
    console.error('Redis keep-alive failed:', error);
  }
};

// Run keep-alive every 30 seconds
setInterval(keepAlive, 30 * 1000);

// Initial keep-alive
keepAlive();

// Handle connection events
redis.on('connect', () => console.log('Redis client connected'));
redis.on('error', (err) => console.error('Redis client error:', err));

module.exports = {
  redis,
  checkRedisHealth,
  keepAlive,
};
