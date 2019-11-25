const redis = require('redis');
const config = require('../common/config');

const redisClient = redis
    .createClient(config.redisUri, { password: config.redisPassword })
    .on('connect', () => {
        console.log('Redis connected!');
    })
    .on('error', err => {
        console.log('Redis not connected!', err);
    });

module.exports = redisClient;
