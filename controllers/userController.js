const crypto = require('crypto');
const mongoose = require('mongoose');
const yup = require('yup');
const User = require('../models/user');
const UserService = require('../services/userService');

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
            const validate = await UserService.validateUserInput(req.body);
            if (validate.name === 'ValidationError') {
                return res.render('registerForm', {
                    title: 'Register',
                    user: req.body,
                    errors: validate.errors,
                });
            }
            const user = UserService.sanitizeUserInput(req.body);

            const found = await UserService.findUserByEmail(req.body.email);
            if (!found) {
                const newUser = await UserService.createUser(user);
                return res.redirect(newUser.url);
            } else {
                return res.render('registerForm', {
                    title: 'Register',
                    user,
                    errors: ['Account already registered!'],
                });
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
        try {
            const user = await UserService.getUser(req.params.id);
            if (!user) {
                return res.status(404).send('User not found!');
            }
            return res.render('userDetails', { title: 'User Details', user });
        } catch (err) {
            next(err);
        }
    },

    getUpdate: async (req, res, next) => {
        try {
            const user = await UserService.getUser(req.params.id);
            return res.render('userDetails', {
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
