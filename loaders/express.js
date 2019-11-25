const config = require('../common/config');
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('../routes/indexRoute');
const catalogRouter = require('../routes/catalogRoute');
const userRouter = require('../routes/userRoute');

const authMiddleware = require('../middlewares/authMiddleware');
const errorMiddleware = require('../middlewares/errorHandler');

const app = express();

// view engine setup
app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'pug');

// process query string
app.set('query parser', queryString => {
    return new URLSearchParams(queryString);
});

// apply middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle routes
app.use('/', indexRouter);
app.use(
    '/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);
app.use('/user', userRouter);

// map routes to lambda functions
app.use('/.netlify/functions/api/', indexRouter);
app.use(
    '/.netlify/functions/api/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);
app.use('/.netlify/functions/api/user', userRouter);

// catch 404 page
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

app.use('/.netlify/functions/api/*', (req, res) => {
    res.status(404).send('Page not found!');
});

// handle errors
app.use((err, req, res, next) => {
    errorMiddleware.createError(err, req, res, next);
});

module.exports = app;
module.exports.handler = serverless(app);
// if (config.serverless === 'on') module.exports.handler = serverless(app);
