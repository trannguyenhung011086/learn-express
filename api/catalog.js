const app = require('./setup');
const catalogRouter = require('../routes/catalogRoute');
const authMiddleware = require('../middlewares/authMiddleware');

app.use(
    '/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);

module.exports = app;
