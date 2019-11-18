const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
        api_user: process.env.SENDGRID_USER,
        api_key: process.env.SENDGRID_KEY,
    },
};

const client = nodemailer.createTransport(sgTransport(options));

const sendEmail = async email => {
    try {
        const send = await client.sendMail(email);
        console.log('Mail sent', send.response);
    } catch (err) {
        console.log('Error with sending email', err);
    }
};

module.exports = sendEmail;
