const config = require('../common/config');
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
const { URLSearchParams } = require('url');
app.set('query parser', queryString => {
    return new URLSearchParams(queryString);
});

// apply middleware
if (process.env.NODE_ENV === 'production') {
    const bugsnag = require('@bugsnag/js');
    const bugsnagExpress = require('@bugsnag/plugin-express');
    const bugsnagClient = bugsnag(config.bugsnag);
    bugsnagClient.use(bugsnagExpress);
    app.use(bugsnagClient.getPlugin('express').requestHandler);
}
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
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

// handle errors
app.use((err, req, res, next) => {
    errorMiddleware.createError(err, req, res, next);
});

module.exports = app;
