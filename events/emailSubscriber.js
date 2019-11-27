const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const UserService = require('../services/userService');

myEmitter.on(
    'user-registered',
    async emailData => await UserService.sendActiveEmail(emailData),
);

myEmitter.on(
    'reset-password',
    async emailData => await UserService.sendResetEmail(emailData),
);

module.exports = myEmitter;
