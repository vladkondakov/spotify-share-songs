const Schemas = require('./validation-schemas.js');
const ApiError = require('../../error/api-error.js');

const validateData = async (schema, data) => {
  try {
    await schema.validateAsync(data);
  } catch (err) {
    throw ApiError.BadRequest('The entered data is not valid.', err.details);
  }
};

class Validation {
  validateRegistration = async (req, res, next) => {
    const { email, password, confirmationPassword } = req.body;
    const { registrationSchema } = Schemas;

    if (password !== confirmationPassword) {
      return next(ApiError.BadRequest('The passwords are not similar.', [req.body]));
    }

    try {
      await validateData(registrationSchema, { email, password, confirmationPassword });
      return next();
    } catch (err) {
      return next(err);
    }
  };

  validateLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const { loginSchema } = Schemas;

    try {
      await validateData(loginSchema, { email, password });
      return next();
    } catch (err) {
      return next(err);
    }
  };

  validatePasswordReset = async (req, res, next) => {
    const { password, confirmationPassword } = req.body;
    const { passwordResetSchema } = Schemas;

    if (password !== confirmationPassword) {
      return next(ApiError.BadRequest('The passwords are not similar.', [req.body]));
    }

    try {
      await validateData(passwordResetSchema, { password, confirmationPassword });
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = new Validation();
