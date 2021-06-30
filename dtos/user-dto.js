/* eslint-disable no-underscore-dangle */
module.exports = class UserDto {
  email;

  id;

  isActivated;

  createdAt;

  activationCode;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.createdAt = model.createdAt;
    this.activationCode = model.activationData.activationCode;
  }
};
