const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const UserService = require('../services/userService');

myEmitter.on(
    'user-registered',
    async user => await UserService.sendActiveEmail(user),
);

module.exports = myEmitter;
