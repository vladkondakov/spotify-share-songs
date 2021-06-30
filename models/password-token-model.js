const { Schema, model } = require('mongoose');

const PasswordTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresIn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('PasswordToken', PasswordTokenSchema);
