require('dotenv').config();
const config = require('./common/config');
const mongo = require('./loaders/mongo');
const redis = require('./loaders/redis');
const app = require('./loaders/express');

app.listen(config.port, () =>
    console.log(`App listening on port ${config.port}`),
);
