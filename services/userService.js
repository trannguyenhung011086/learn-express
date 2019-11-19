const mongoose = require('mongoose');
const yup = require('yup');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Utils = require('../common/utils');
const User = require('../models/userModel');
const config = require('../common/config');
const redisClient = require('../redis');

module.exports = {
    validateUserInput: async user => {
        const schema = yup.object().shape({
            firstName: yup
                .string()
                .max(100)
                .required(),
            lastName: yup
                .string()
                .max(100)
                .required(),
            email: yup
                .string()
                .email()
                .required(),
            password: yup
                .string()
                .min(6)
                .required(),
        });
        return await schema.validate(user).catch(err => err);
    },

    sanitizeUserInput: user => {
        return {
            firstName: Utils.escape(user.firstName),
            lastName: Utils.escape(user.lastName),
            email: user.email.toLowerCase(),
            password: user.password,
        };
    },

    findUserByEmail: async email => {
        if (!email) return false;
        return await User.findOne({
            email: email.toLowerCase(),
        }).exec();
    },

    createUser: async user => {
        user.password = Utils.hashText(user.password);
        return await User.create(user);
    },

    getUser: async id => {
        id = mongoose.Types.ObjectId(id);
        return await User.findById(id).exec();
    },

    updateUser: async (userId, update) => {
        userId = mongoose.Types.ObjectId(userId);
        if (update.password && update.password.split('$')[0].length != 24) {
            update.password = Utils.hashText(update.password);
        }
        return await User.findByIdAndUpdate(userId, update).exec();
    },

    checkPasswordMatch: (password, user) => {
        if (!password) return false;
        const passwordFields = user.password.split('$');

        const salt = passwordFields[0];
        const hash = crypto
            .createHmac('sha512', salt)
            .update(password)
            .digest('base64');

        if (hash != passwordFields[1]) return false;
        return true;
    },

    grantToken: user => {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: config.accessTokenLife,
        });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: config.refreshTokenLife,
        });
        return { accessToken, refreshToken };
    },

    revokeToken: req => {
        const token = Utils.getTokenFromHeader(req);
        return redisClient.sadd('blacklistTokens', token);
    },

    generateActiveCode: () => {
        const activeCode = crypto.randomBytes(20).toString('hex');
        const activeCodeExpires = Date.now() + 24 * 3600 * 1000;
        return { activeCode, activeCodeExpires };
    },

    sendActiveEmail: async ({ userName, userEmail, activeLink }) => {
        const email = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Activation Email',
            text: `Hello ${userName}, please use the following link to activate your account: ${activeLink}`,
            html: `Hello <b>${userName}</b>, please use the following link to activate your account: <a href="${activeLink}">here</a> to activate your account.`,
        };
        await Utils.sendEmail(email);
    },
};
