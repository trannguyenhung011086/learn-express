const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const config = require('../common/config');
const Utils = require('../common/utils');
const redisClient = require('../redis');

module.exports = {
    validateHeader: async (req, res, next) => {
        const token = Utils.getTokenFromHeader(req);
        if (!token) {
            // return res.status(401).send('No token!');
            return res.redirect('/user/login');
        }

        const { promisify } = require('util');
        const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
        const blacklist = await smembersAsync('blacklistTokens');
        if (blacklist.includes(token)) {
            return res.status(401).send('Revoked token!');
        }

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(400).send('Invalid token!');
        }
        return next();
    },

    isLoginRedirect: (req, res, next) => {
        const token = Utils.getTokenFromHeader(req);
        if (token) {
            return res.redirect('/catalog');
        }
        return next();
    },

    refreshToken: (req, res, next) => {
        const token = Utils.getTokenFromHeader(req);
        if (token) {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
