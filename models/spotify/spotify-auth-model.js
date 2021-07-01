const { Schema, model } = require('mongoose');

const SpotifyAuthSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    default: 'Bearer',
  },
  expiresIn: {
    type: Date,
    default: Date.now(),
  },
  refreshToken: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
});

module.exports = model('SpotifyAuth', SpotifyAuthSchema);
