const app = require('./setup');
const userRouter = require('../routes/userRoute');

app.use('/user', userRouter);
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

module.exports = app;
