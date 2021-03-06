const mongoose = require('mongoose');
const yup = require('yup');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multiparty = require('multiparty');

const Utils = require('../common/utils');
const config = require('../common/config');
const User = require('../models/userModel');
const redisClient = require('../loaders/redis');

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

    sanitizePassword: async password => {
        const schema = yup
            .string()
            .min(6)
            .required();
        return await schema.validate(password).catch(err => err);
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
        if (/[0-9a-zA-Z]{24}/.test(id) === false) return null;
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
        const accessToken = jwt.sign(user, config.accessTokenSecret, {
            expiresIn: config.accessTokenLife,
        });
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
            expiresIn: config.refreshTokenLife,
        });
        return { accessToken, refreshToken };
    },

    revokeToken: req => {
        const token = Utils.getTokenFromHeader(req);
        const { promisify } = require('util');
        const saddAsync = promisify(redisClient.sadd).bind(redisClient);
        saddAsync('blacklistTokens', token);
    },

    generateActiveCode: () => {
        const activeCode = crypto.randomBytes(20).toString('hex');
        const activeCodeExpires = Date.now() + 24 * 3600 * 1000;
        return { activeCode, activeCodeExpires };
    },

    sendActiveEmail: async ({ userName, userEmail, activeLink }) => {
        const email = {
            from: config.email,
            to: userEmail,
            subject: 'Activation Email',
            text: `Hello ${userName}, please use the following link to activate your account: ${activeLink}`,
            html: `Hello <b>${userName}</b>, please use the following link to activate your account: <a href="${activeLink}">here</a> to activate your account.`,
        };
        await Utils.sendEmail(email);
    },

    sendResetEmail: async ({ userName, userEmail, activeLink }) => {
        const email = {
            from: config.email,
            to: userEmail,
            subject: 'Reset Password Email',
            text: `Hello ${userName}, please use the following link to reset your password: ${activeLink}`,
            html: `Hello <b>${userName}</b>, please use the following link to reset your password: <a href="${activeLink}">here</a> to activate your account.`,
        };
        await Utils.sendEmail(email);
    },

    uploadAvatar: (req, res, next) => {
        const form = new multiparty.Form();

        form.on('part', part => {
            part.on('error', err => next(err));
            if (!part.headers['content-type'].match('image')) {
                return next(Error('File is not image!'));
            } else {
                // upload to cloud logic
            }
        });

        form.on('file', (name, file) => {
            console.log(file);
            if (!file.headers['content-type'].match('image')) {
                return next(Error('File is not image!'));
            } else {
                res.redirect(`/user/${req.params.id}`);
                fs.copyFile(
                    file.path,
                    path.resolve(
                        __dirname,
                        '../public/images/',
                        file.originalFilename,
                    ),
                    err => {
                        if (err) return next(err);
                    },
                );
            }
        });
        form.on('error', err => next(err));
        form.parse(req);
    },
};
