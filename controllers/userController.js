const UserService = require('../services/userService');
const config = require('../common/config');
const emailSubscriber = require('../events/emailSubscriber');

module.exports = {
    index: (req, res) => {
        res.redirect('/');
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

            if (found) {
                return res.render('registerForm', {
                    title: 'Register',
                    user,
                    errors: ['Account already registered!'],
                });
            }

            const active = UserService.generateActiveCode();
            user.activeCode = active.activeCode;
            user.activeCodeExpires = active.activeCodeExpires;

            const newUser = await UserService.createUser(user);

            const emailData = {
                userName: newUser.fullName,
                userEmail: newUser.email,
                activeLink: `${config.baseUrl}/user/active/${newUser._id}&${newUser.activeCode}`,
            };
            emailSubscriber.emit('user-registered', emailData);

            return res.redirect('/user/login');
        } catch (err) {
            next(err);
        }
    },

    getActive: async (req, res, next) => {
        try {
            let user = await UserService.getUser(req.params.userId);
            if (!user) {
                return res.status(404).send('User not found!');
            }

            const activeCode = req.params.activeCode;
            if (user.activeCode != activeCode.trim()) {
                return res.status(400).send('Invalid active code!');
            }

            user.active = true;
            user.role = 'user';
            await UserService.updateUser(user._id, user);
            return res.redirect('/user/login');
        } catch (err) {
            next(err);
        }
    },

    getLogin: (req, res) => {
        res.render('loginForm', { title: 'Login', user: req.body });
    },

    postLogin: async (req, res, next) => {
        try {
            const { password, email, role } = req.body;

            const user = await UserService.findUserByEmail(email);
            if (!user) {
                return res.render('loginForm', {
                    title: 'Login',
                    user: req.body,
                    errors: ['Account does not exist!'],
                });
            }

            const checkPassword = UserService.checkPasswordMatch(
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

            if (!user.active) {
                return res.render('loginForm', {
                    title: 'Login',
                    user: req.body,
                    errors: ['Account is not activated!'],
                });
            }

            const tokens = UserService.grantToken({
                email,
                role: role || 'user',
            });

            res.cookie('accessToken', tokens.accessToken, {
                maxAge: config.accessTokenLife * 1000,
                httpOnly: true,
                overwrite: true,
            });
            res.redirect(`/user/${user._id}`);
            // res.status(200).json(tokens);
        } catch (err) {
            next(err);
        }
    },

    postLogout: async (req, res, next) => {
        try {
            await UserService.revokeToken(req);
            res.cookie('accessToken', '', {
                maxAge: 0,
                httpOnly: true,
                overwrite: true,
            });
            return res.redirect('/user/login');
        } catch (err) {
            next(err);
        }
    },

    getForgotPassword: async (req, res, next) => {
        try {
            return res.render('forgotForm', { title: 'Forgot Password' });
        } catch (err) {
            next(err);
        }
    },

    postForgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await UserService.findUserByEmail(email);
            if (!user) {
                return res.render('forgotForm', {
                    title: 'Forgot Password',
                    errors: ['Email does not exist!'],
                });
            }

            const active = UserService.generateActiveCode();
            user.activeCode = active.activeCode;
            user.activeCodeExpires = active.activeCodeExpires;

            const emailData = {
                userName: user.fullName,
                userEmail: user.email,
                activeLink: `${config.baseUrl}/user/reset/${user._id}&${user.activeCode}`,
            };
            emailSubscriber.emit('reset-password', emailData);

            return res.render('forgotForm', {
                title: 'Forgot Password',
                successMessage:
                    'Please check your email for reset password link!',
            });
        } catch (err) {
            next(err);
        }
    },

    getResetPassword: async (req, res, next) => {
        try {
            const userId = req.params.id.split('&')[0];
            const user = await UserService.getUser(userId);
            if (!user) {
                return res.status(404).send('User not found!');
            }

            return res.render('resetForm', { title: 'Reset Password' });
        } catch (err) {
            next(err);
        }
    },

    postResetPassword: async (req, res, next) => {
        try {
            const userId = req.params.id.split('&')[0];
            const user = await UserService.getUser(userId);
            if (!user) {
                return res.status(404).send('User not found!');
            }

            let { password, confirmPassword } = req.body;

            const validate = await UserService.sanitizePassword(password);
            if (validate.name === 'ValidationError') {
                return res.render('resetForm', {
                    title: 'Reset Password',
                    password,
                    confirmPassword,
                    errors: validate.errors,
                });
            }

            if (password != confirmPassword) {
                return res.render('resetForm', {
                    title: 'Reset Password',
                    password,
                    confirmPassword,
                    errors: ['Confirm password does not match!'],
                });
            }

            user.password = confirmPassword;
            await UserService.updateUser(user._id, user);
            return res.redirect('/user/login');
        } catch (err) {
            next(err);
        }
    },

    getDetails: async (req, res, next) => {
        try {
            const user = await UserService.getUser(req.params.id);
            if (!user) {
                const err = new Error('User not found!');
                err.status = 404;
                next(err);
            }
            return res.render('userDetails', { title: 'Profile', user });
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
                const err = new Error('User not found!');
                err.status = 404;
                next(err);
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
