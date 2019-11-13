const mongoose = require('mongoose');
const yup = require('yup');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Utils = require('../common/utils');
const User = require('../models/user');
const config = require('../common/config');

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

    updateUser: async (id, update) => {
        id = mongoose.Types.ObjectId(id);
        update.password = Utils.hashText(update.password);
        return await User.findByIdAndUpdate(id, update).exec();
    },

    checkPasswordMatch: async (password, user) => {
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
        const accessToken = jwt.sign(user, process.env.ACCESSTOKENSECRET, {
            expiresIn: config.accessTokenLife,
        });
        const refreshToken = jwt.sign(user, process.env.REFRESHTOKENSECRET, {
            expiresIn: config.refreshTokenLife,
        });
        return { accessToken, refreshToken };
    },
};
