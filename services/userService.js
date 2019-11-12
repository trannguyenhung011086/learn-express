const mongoose = require('mongoose');
const yup = require('yup');
const Utils = require('../common/utils');
const User = require('../models/user');

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
};
