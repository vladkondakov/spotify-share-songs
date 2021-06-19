const ApiError = require('../error/api-error.js');
const tokenService = require('../services/token-service.js');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
      return next(ApiError.Unauthorized());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.Unauthorized);
    }

    req.user = userData;
    return next();
  } catch (err) {
    return next(ApiError.Unauthorized());
  }
};
