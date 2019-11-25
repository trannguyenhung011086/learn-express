require('dotenv').config();

module.exports = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenLife: 900,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: 86400,
    mongoDatabase:
        process.env.MONGODB_URI || 'mongodb://localhost:27017/learn-express',
    redisUri: process.env.REDIS_URI || 'redis://127.0.0.1:6379/0',
    redisPassword: process.env.REDIS_PASSWORD,
    sendgridKey: process.env.SENDGRID_KEY,
    email: process.env.EMAIL || 'learn-express@express.com',
    baseUrl: process.env.BASE_URL || 'http://localhost:4000',
    port: process.env.PORT || 3000,
    serverless: process.env.SERVERLESS || 'off',
};
