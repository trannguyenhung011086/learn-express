const redis = require('redis');

const redisClient = redis
    .createClient(process.env.REDIS_URL)
    .on('connect', () => {
        console.log('Redis connected!');
    })
    .on('error', err => {
        console.log('Redis not connected!', err);
    });

module.exports = redisClient;
