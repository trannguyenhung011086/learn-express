require('dotenv').config();

module.exports = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenLife: 900,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: 86400,
    mongoDatabase: process.env.DATABASE || process.env.ATLAS,
    redisUrl: process.env.REDIS_URL,
    sendgridKey: process.env.SENDGRID_KEY,
    email: process.env.EMAIL,
    baseUrl: process.env.BASE_URL,
    port: process.env.PORT || 3000,
    serverless: process.env.SERVERLESS || 'off',
};
