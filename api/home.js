const app = require('./setup');
const indexRouter = require('../routes/indexRoute');

app.use('/', indexRouter);

module.exports = app;
