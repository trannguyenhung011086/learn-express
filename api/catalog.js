const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const catalogRouter = require('../routes/catalogRoute');

const authMiddleware = require('../middlewares/authMiddleware');

const app = express();
const mongo = require('../loaders/mongo');
const redis = require('../loaders/redis');

// view engine setup
app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'pug');

// process query string
const { URLSearchParams } = require('url');
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
app.use(
    '/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);

module.exports = app;
