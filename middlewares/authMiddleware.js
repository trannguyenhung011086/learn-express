const jwt = require('jsonwebtoken');

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
            return res.status(401).send('No token found!');
        }
        try {
            jwt.verify(token, process.env.ACCESSTOKENSECRET);
        } catch (err) {
            return res.status(400).send('Invalid token!');
        }
        return next();
    },

    isLogin: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.redirect('/user');
        }
        return next();
    },
};
