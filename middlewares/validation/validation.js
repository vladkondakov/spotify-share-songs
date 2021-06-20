const { registrationSchema } = require('./validation-schemas.js');
const ApiError = require('../../error/api-error.js');

class Validation {
  validateRegistration = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      await registrationSchema.validateAsync({ email, password });
      return next();
    } catch (err) {
      return next(ApiError.BadRequest('The entered data is not valid.', err.details));
    }
  };
}

module.exports = new Validation();
