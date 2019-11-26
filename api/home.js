const app = require('./setup');
const indexRouter = require('../routes/indexRoute');

app.use('/', indexRouter);
app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

module.exports = app;
