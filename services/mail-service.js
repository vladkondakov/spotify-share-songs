const nodemailer = require('nodemailer');
const config = require('../config/config.js');

const activationCodeTime = config.ACTIVATION_CODE_TIME / 100 / 60;
const resetPasswordTokenTime = config.RESET_PASSWORD_TOKEN_TIME / 100 / 60;
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendActivationMail = async (to, link) => {
    const htmlText = `
      <div>
        <h1>Follow the link to activate your account:</h1>
        <a href="${link}">${link}</a>
        <p>This link is valid for ${activationCodeTime} minutes.</p>
      </div>`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation on ${process.env.API_URL}`,
      text: '',
      html: htmlText,
    });
  };

  sendResetPasswordMail = async (to, link) => {
    const htmlText = `
      <div>
        <h1>Follow the link to reset your password:</h1>
        <a href="${link}">${link}</a>
        <p>This link is valid for ${resetPasswordTokenTime} minutes.</p>
        <h1>If it was not you, then do not follow the link.</h1>
      </div>`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Password reset on ${process.env.API_URL}`,
      text: '',
      html: htmlText,
    });
  };

  sendResetPasswordSuccessfulMail = async (to) => {
    const htmlText = `
      <div>
        <h1>Password was changed successfully.</h1>
      </div>`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Password reset',
      text: '',
      html: htmlText,
    });
  };
}

module.exports = new MailService();
