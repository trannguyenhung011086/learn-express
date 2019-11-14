const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const config = require('../common/config');

const getTokenFromHeader = req => {
    let token = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.slit(' ')[0] === 'Bearer'
    ) {
        token = req.headers.authorization.slit(' ')[1];
    }
    if (!token && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    return token;
};

module.exports = {
    validateHeader: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            // return res.status(401).send('No token found!');
            return res.redirect('/user/login');
        }
        try {
            jwt.verify(token, process.env.ACCESSTOKENSECRET);
        } catch (err) {
            return res.status(400).send('Invalid token!');
        }
        return next();
    },

    isLoginRedirect: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token) {
            return res.redirect('/catalog');
        }
        return next();
    },

    refreshToken: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token) {
            const payload = jwt.verify(token, process.env.ACCESSTOKENSECRET);
            const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

            if (payload.exp - nowUnixSeconds > 30) {
                return next();
            } else {
                const tokens = UserService.grantToken({
                    email: payload.email,
                });
                res.cookie('accessToken', tokens.accessToken, {
                    maxAge: config.accessTokenLife * 1000,
                    httpOnly: true,
                });
                return next();
            }
        }
        return next();
    },
};
