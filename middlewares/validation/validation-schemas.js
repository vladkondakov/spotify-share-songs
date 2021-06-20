const Joi = require('joi');

const registrationSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(3).max(16).required(),
  })
  .options({ abortEarly: false });

const loginSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(3).max(16).required(),
  })
  .options({ abortEarly: false });

module.exports = {
  registrationSchema,
  loginSchema,
};
