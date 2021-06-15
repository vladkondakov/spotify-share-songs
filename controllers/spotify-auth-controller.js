const querystring = require('querystring');
const { default: axios } = require('axios');
const Helpers = require('../helpers/helpers.js');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_AUTHORIZE_URI,
  STATE_KEY,
  SCOPE,
  SPOTIFY_AUTH_BASE_URL,
} = require('../config/config.js');

const redirectURI = `${SPOTIFY_AUTH_BASE_URL}/authCallback`;

const login = (req, res) => {
  const state = Helpers.generateRandomString(16);
  const activeScope = Helpers.getActiveScope(SCOPE);

  res.cookie(STATE_KEY, state);

  res.redirect(
    SPOTIFY_AUTHORIZE_URI +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: activeScope,
        redirect_uri: redirectURI,
        state,
      })
  );
};

const authCallback = async (req, res, next) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    return next(Error('state_mismatch'));
  }

  res.clearCookie(STATE_KEY);

  const options = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      code,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  };

  try {
    const authResponse = await axios(options);
    if (authResponse.status !== 200) {
      return next(Error('invalid_token'));
    }
    return res.json(authResponse.data);
  } catch (err) {
    return next(err);
  }
};

const refreshAccessToken = async (req, res, next) => {
  const { refresh_token: refreshToken } = req.query;

  const options = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  };

  try {
    const refreshTokenResponse = await axios(options);
    if (refreshTokenResponse.status !== 200) {
      return next(Error('invalid_token: provided token is invalid'));
    }
    return res.json({
      access_token: refreshTokenResponse.data.access_token,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  authCallback,
  refreshAccessToken,
};
