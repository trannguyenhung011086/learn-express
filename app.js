const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Mongo connected!'))
    .catch(err => console.log(err));

const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');
const userRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// apply middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle routes
app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/user', userRouter);

// catch 404 page
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

module.exports = app;
