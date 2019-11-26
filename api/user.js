const app = require('./setup');
const userRouter = require('../routes/userRoute');

app.use('/user', userRouter);

module.exports = app;
