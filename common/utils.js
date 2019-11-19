const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

module.exports = {
    hashText: text => {
        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto
            .createHmac('sha512', salt)
            .update(text)
            .digest('base64');
        return salt + '$' + hash;
    },

    escape: text =>
        text.replace(/[^0-9A-Za-z ]/g, c => '&#' + c.charCodeAt(0) + ';'),

    sendEmail: async email => {
        const options = {
            auth: {
                api_key: process.env.SENDGRID_KEY,
            },
        };
        const mailer = nodemailer.createTransport(sgTransport(options));
        try {
            const send = await mailer.sendMail(email);
            console.log('Mail sent', send);
            return send;
        } catch (err) {
            console.log('Error with sending email', err);
        }
    },

    getTokenFromHeader: req => {
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
    },
};
