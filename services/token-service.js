const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model.js');

class TokenService {
  generateTokens = (payload) => {
    const {
      JWT_ACCESS_SECRET: jwtAccessSecret,
      JWT_REFRESH_SECRET: jwtRefreshSecret,
      JWT_ACCESS_TIME: jwtAccessTime,
      JWT_REFRESH_TIME: jwtRefreshTime,
    } = process.env;

    const accessToken = jwt.sign(payload, jwtAccessSecret, { expiresIn: jwtAccessTime });
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: jwtRefreshTime });

    return { accessToken, refreshToken };
  };

  saveToken = async (userId, refreshToken) => {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  };

  validateAccessToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  };

  validateRefreshToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  };

  removeToken = async (refreshToken) => {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  };

  findToken = async (refreshToken) => {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  };
}

module.exports = new TokenService();
