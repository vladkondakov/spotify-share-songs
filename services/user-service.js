const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model.js');
const mailService = require('./mail-service.js');
const tokenService = require('./token-service.js');
const UserDto = require('../dtos/user-dto.js');

class UserService {
  registration = async (email, password) => {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new Error(`User ${email} has been found.`);
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
      throw new Error('Wrong activation link');
    }

    user.isActivated = true;
    await user.save();
  };
}

module.exports = new UserService();
