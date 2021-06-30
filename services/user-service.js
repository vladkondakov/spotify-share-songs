const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model.js');
const mailService = require('./mail-service.js');
const tokenService = require('./token-service.js');
const passwordTokenService = require('./password-token-service.js');
const UserDto = require('../dtos/user-dto.js');
const ApiError = require('../error/api-error.js');
const { isExpired, getActivationCodeExpiresTime } = require('../helpers/helpers.js');

class UserService {
  registration = async (email, password) => {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(`User ${email} has been found.`);
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const activationCode = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      activationData: {
        activationCode,
        expiresIn: getActivationCodeExpiresTime(),
      },
    });

    const validActivationLink = `${process.env.API_URL}/api/auth/activate/${activationCode}`;

    await mailService.sendActivationMail(email, validActivationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  activate = async (activationCode) => {
    const user = await UserModel.findOne({ 'activationData.activationCode': activationCode });

    if (!user) {
      throw ApiError.BadRequest('Wrong activation code.');
    }

    if (isExpired(user.activationData.expiresIn)) {
      throw ApiError.Gone();
    }

    user.isActivated = true;
    await user.save();
  };

  refreshActivationCode = async (activationCode) => {
    const user = await UserModel.findOne({ 'activationData.activationCode': activationCode });

    if (!user) {
      throw ApiError.BadRequest('Wrong activation code.');
    }

    const newCode = uuid.v4();
    const validActivationLink = `${process.env.API_URL}/api/auth/activate/${newCode}`;

    await mailService.sendActivationMail(user.email, validActivationLink);

    user.activationData = {
      activationCode: newCode,
      expiresIn: getActivationCodeExpiresTime(),
    };

    await user.save();

    return newCode;
  };

  login = async (email, password) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(`User ${email} does not exist.`);
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

  refresh = async (refreshToken) => {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const existingToken = await tokenService.findToken(refreshToken);

    if (!userData || !existingToken) {
      throw ApiError.Unauthorized();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };

  getAllUsers = async () => {
    const users = await UserModel.find();
    return users;
  };

  requestPasswordReset = async (email) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(`User ${email} does not exist.`);
    }

    const { id } = new UserDto(user);
    const token = passwordTokenService.generateResetToken(id);

    // get the address of the resource from which the request was sent?
    const resetLink = `${process.env.CLIENT_URL}/api/auth/reset/password-by-link?token=${token}&id=${id}`;

    mailService.sendResetPasswordMail(id, resetLink);

    return { token, id };
  };

  resetPassword = async (resetData) => {
    const { email, token, password, userID } = resetData;

    const resetToken = await passwordTokenService.validateToken(token, userID);

    if (!resetToken) {
      throw ApiError.BadRequest('Invalid or expired password reset token.');
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const user = await UserModel.findOne({ email });

    user.password = hashedPassword;
    await user.save();

    await mailService.sendActivationMail(email);
  };
}

module.exports = new UserService();
