const crypto = require('crypto');
const mongoose = require('mongoose');
const yup = require('yup');
const User = require('../models/user');

module.exports = {
    index: (req, res) => {
        // check login session
        res.redirect('/user/login');
    },

    getRegister: (req, res) => {
        res.render('registerForm', { title: 'Register', user: req.body });
    },

    postRegister: async (req, res, next) => {
        try {
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
            try {
                await schema.validate(req.body);
            } catch (err) {
                res.render('registerForm', {
                    title: 'Register',
                    user: req.body,
                    errors: err.errors,
                });
                return;
            }

            const user = await User.findOne({
                email: req.body.email.toLowerCase(),
            }).exec();

            if (!user) {
                const salt = crypto.randomBytes(16).toString('base64');
                const hash = crypto
                    .createHmac('sha512', salt)
                    .update(req.body.password)
                    .digest('base64');
                req.body.password = salt + '$' + hash;

                const newUser = await User.create(req.body);
                res.redirect(newUser.url);
            } else {
                res.render('registerForm', {
                    title: 'Register',
                    user: req.body,
                    errors: ['Account already registered!'],
                });
                return;
            }
        } catch (err) {
            next(err);
        }
    },

    getLogin: (req, res) => {
        res.render('loginForm', { title: 'Login', user: req.body });
    },

    postLogin: (req, res) => {
        res.send('TODO: post user login');
    },

    postLogout: (req, res) => {
        res.send('TODO: post user logout');
    },

    getForgotPassword: (req, res) => {
        res.send('TODO: get user forgot password');
    },

    postForgotPassword: (req, res) => {
        res.send('TODO: post user forgot password');
    },

    getDetails: async (req, res, next) => {
        const id = mongoose.Types.ObjectId(req.params.id);
        try {
            const user = await User.findById(id).exec();
            if (!user) {
                res.status(404).send('User not found!');
                return;
            }
            res.render('userDetails', { title: 'User Details', user });
        } catch (err) {
            next(err);
        }
    },

    getUpdate: async (req, res, next) => {
        try {
            const id = mongoose.Types.ObjectId(req.params.id);
            const user = await User.findById(id).exec();
            res.render('userDetails', {
                title: 'User Details',
                user,
                update: true,
            });
        } catch (err) {
            next(err);
        }
    },

    postUpdate: (req, res) => {
        res.send('TODO: post user update');
    },

    getDelete: (req, res) => {
        res.send('TODO: get user delete');
    },

    postDelete: (req, res) => {
        res.send('TODO: post user delete');
    },
};
