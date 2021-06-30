const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationData: {
    activationCode: {
      type: String,
    },
    expiresIn: {
      type: Date,
      default: Date.now(),
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('User', UserSchema);
