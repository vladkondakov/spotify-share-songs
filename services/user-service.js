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
    const user = await UserModel.create({ email, password: hashedPassword, activationLink });
    const validActivationLink = `${process.env.API_URL}/api/activate/${activationLink}`;

    await mailService.sendActivationMail(email, validActivationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  };
}

module.exports = new UserService();
