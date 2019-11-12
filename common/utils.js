const crypto = require('crypto');

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
};
