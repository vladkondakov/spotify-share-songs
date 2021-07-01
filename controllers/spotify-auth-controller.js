const axios = require('axios');
const SpotifyAuthService = require('../services/spotify/auth-service.js');

const { CLIENT_ID, CLIENT_SECRET, STATE_KEY, SCOPE } = require('../config/config.js');

class SpotifyAuthController {
  login = (req, res) => {
    const scope = req.scope || SCOPE;
    const { redirectUri, state } = SpotifyAuthService.getAuthFlowData(scope);

    res.cookie(STATE_KEY, state);
    res.redirect(redirectUri);
  };

  authCallback = async (req, res, next) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

    try {
      SpotifyAuthService.checkState(state, storedState);

      res.clearCookie(STATE_KEY);

      const authData = await SpotifyAuthService.getAuthData(code);
      return res.json(authData);
    } catch (err) {
      return next(err);
    }
  };

  refreshAccessToken = async (req, res, next) => {
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
}

module.exports = new SpotifyAuthController();
