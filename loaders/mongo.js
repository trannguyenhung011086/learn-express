const mongoose = require('mongoose');
const config = require('../common/config');

const mongoClient = mongoose
    .connect(config.mongoDatabase, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Mongo connected!'))
    .catch(err => console.log('Mongo not connected!', err));

module.exports = mongoClient;
