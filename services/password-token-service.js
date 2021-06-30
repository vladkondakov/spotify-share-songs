const crypto = require('crypto');
const bcrypt = require('bcrypt');
const PasswordTokenModel = require('../models/password-token-model.js');
const { getResetPasswordTokenExpiresTime, isExpired } = require('../helpers/helpers.js');

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
    try {
      const passwordResetToken = await PasswordTokenModel.findOne({ user: userID });

      if (!passwordResetToken) {
        return null;
      }

      if (isExpired(passwordResetToken.expiresIn)) {
        return null;
      }

      const isValid = await bcrypt.compare(token, passwordResetToken.token);

      if (!isValid) {
        return null;
      }

      const validToken = passwordResetToken.token;
      passwordResetToken.deleteOne();

      return validToken;
    } catch (err) {
      return null;
    }
  };
}

module.exports = new PasswordTokenService();
