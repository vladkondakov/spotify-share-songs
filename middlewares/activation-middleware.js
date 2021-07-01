const ApiError = require('../error/api-error.js');
const UserModel = require('../models/user-model.js');

module.exports = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await UserModel.findOne({ email });

    if (user.isActivated === false) {
      return next(ApiError.Forbidden('User is not activated.'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
