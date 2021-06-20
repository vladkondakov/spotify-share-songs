const Schemas = require('./validation-schemas.js');
const ApiError = require('../../error/api-error.js');

class Validation {
  validateRegistration = async (req, res, next) => {
    const { email, password } = req.body;
    const { registrationSchema } = Schemas;

    try {
      await registrationSchema.validateAsync({ email, password });
      return next();
    } catch (err) {
      return next(ApiError.BadRequest('The entered data is not valid.', err.details));
    }
  };

  validateLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const { loginSchema } = Schemas;

    try {
      await loginSchema.validateAsync({ email, password });
      return next();
    } catch (err) {
      return next(ApiError.BadRequest('The entered data is not valid', err.details));
    }
  };
}

module.exports = new Validation();
