const app = require('./setup');
const catalogRouter = require('../routes/catalogRoute');
const authMiddleware = require('../middlewares/authMiddleware');

app.use(
    '/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

module.exports = app;
