const { createClient } = require('redis');

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  }
});

redisClient.connect().catch(console.error);

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis', err);
});

redisClient.on('connect', async() => {
  console.log('Connected to Redis');
});

module.exports = redisClient;