/* eslint-disable no-underscore-dangle */
module.exports = class UserDto {
  email;

  id;

  isActivated;

  createdAt;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.createdAt = model.createdAt;
  }
};
