const { createClient } = require('redis');
require("dotenv").config();

const cachedSessions = new Map();
let redisClient = undefined;

// if( process.env.ENVIRONMENT !== 'local'){
  redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  });

  redisClient.connect().catch(console.error);
  
  redisClient.on('error', (err) => {
    console.error('Error connecting to Redis', err);
    console.log( "process.env.ENVIRONMENT" );
    console.log( process.env.ENVIRONMENT );
  });
  
  redisClient.on('connect', async() => {
    console.log('Connected to Redis');
  });
// };
  
module.exports = { redisClient, cachedSessions:() => cachedSessions };