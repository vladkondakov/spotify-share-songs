const crypto = require('crypto');
const bcrypt = require('bcrypt');
const PasswordTokenModel = require('../models/password-token-model.js');
const { getResetPasswordTokenExpiresTime, isExpired } = require('../helpers/helpers.js');
const ApiError = require('../error/api-error.js');

class PasswordTokenService {
  generateResetToken = async (userID) => {
    const token = await PasswordTokenModel.findOne({ user: userID });

    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 4);

    const passwordResetToken = await PasswordTokenModel.create({
      user: userID,
      token: resetTokenHash,
      createdAt: Date.now(),
      expiresIn: getResetPasswordTokenExpiresTime(),
    });

    return passwordResetToken.token;
  };

  validateToken = async (token, userID) => {
    const passwordResetToken = await PasswordTokenModel.findOne({ user: userID });

    if (!passwordResetToken) {
      throw ApiError.BadRequest('Invalid password reset token.');
    }

    if (isExpired(passwordResetToken.expiresIn)) {
      throw ApiError.BadRequest('Expired password reset token.');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw ApiError.BadRequest('Wrong password reset token.');
    }

    passwordResetToken.deleteOne();
  };
}

module.exports = new PasswordTokenService();
