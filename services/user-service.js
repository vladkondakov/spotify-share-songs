const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model.js');
const mailService = require('./mail-service.js');
const tokenService = require('./token-service.js');
const UserDto = require('../dtos/user-dto.js');
const ApiError = require('../error/api-error.js');

class UserService {
  registration = async (email, password) => {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(`User ${email} has been found.`);
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      activationEmailLink: activationLink,
    });

    const validActivationLink = `${process.env.API_URL}/api/auth/activate/${activationLink}`;

    await mailService.sendActivationMail(email, validActivationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  activate = async (activationLink) => {
    const user = await UserModel.findOne({ activationEmailLink: activationLink });

    if (!user) {
      throw ApiError.BadRequest('Wrong activation link.');
    }

    user.isActivated = true;
    await user.save();
  };

  login = async (email, password) => {
    const user = await UserModel.findOne({ email });

    // return an object with static message and email in a separate field
    if (!user) {
      throw ApiError.BadRequest(`User ${email} hasn't been found.`);
    }

    const isPasswordEquals = await bcrypt.compare(password, user.password);

    if (!isPasswordEquals) {
      throw ApiError.BadRequest('Wrong password.');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  logout = async (refreshToken) => {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  };
}

module.exports = new UserService();
