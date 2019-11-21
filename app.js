const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Mongo connected!'))
    .catch(err => console.log('Mongo not connected!', err));

const indexRouter = require('./routes/indexRoute');
const catalogRouter = require('./routes/catalogRoute');
const userRouter = require('./routes/userRoute');

const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorHandler');

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
app.use(
    '/catalog',
    authMiddleware.validateToken,
    authMiddleware.refreshToken,
    catalogRouter,
);
app.use('/user', userRouter);

// catch 404 page
// app.use('*', (req, res) => {
//     res.status(404).send('Page not found!');
// });

// handle errors
// app.use((err, req, res, next) => {
//     errorMiddleware.createError(err, req, res, next);
// });

module.exports = app;
