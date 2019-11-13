const UserService = require('../services/userService');
const config = require('../common/config');

module.exports = {
    index: (req, res) => {
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

            const found = await UserService.findUserByEmail(user.email);
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

    postLogin: async (req, res, next) => {
        try {
            const { password, firstName, lastName, email } = req.body;

            const user = await UserService.findUserByEmail(email);
            if (!user) {
                return res.status(404).send('User not found!');
            }

            const checkPassword = await UserService.checkPasswordMatch(
                password,
                user,
            );
            if (checkPassword === false) {
                return res.render('loginForm', {
                    title: 'Login',
                    user: req.body,
                    errors: ['Invalid email or password!'],
                });
            }

            const tokens = UserService.grantToken({
                firstName,
                lastName,
                email,
            });

            res.cookie('accessToken', tokens.accessToken, {
                maxAge: config.accessTokenLife * 1000,
                httpOnly: true,
            });
            res.redirect('/catalog');
            // res.status(200).json(tokens);
        } catch (err) {
            next(err);
        }
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

    postUpdate: async (req, res, next) => {
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
            if (found) {
                const updatedUser = await UserService.updateUser(
                    req.params.id,
                    user,
                );
                return res.redirect(updatedUser.url);
            } else {
                return res.status(404).send('User not found!');
            }
        } catch (err) {
            next(err);
        }
    },

    getDelete: (req, res) => {
        res.send('TODO: get user delete');
    },

    postDelete: (req, res) => {
        res.send('TODO: post user delete');
    },
};
