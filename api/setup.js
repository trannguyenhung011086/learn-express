const config = require('../common/config');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const bugsnagClient = bugsnag(config.bugsnag);
bugsnagClient.use(bugsnagExpress);

const errorMiddleware = require('../middlewares/errorHandler');

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
app.use(bugsnagClient.getPlugin('express').requestHandler);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle errors
app.use((err, req, res, next) => {
    errorMiddleware.createError(err, req, res, next);
});

module.exports = app;
