const querystring = require('querystring');
const request = require('request');
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

const authCallback = (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      `/#${querystring.stringify({
        error: 'state_mismatch',
      })}`
    );
  } else {
    res.clearCookie(STATE_KEY);

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token: accessToken } = body;
        const { refresh_token: refreshToken } = body;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: `Bearer ${accessToken}` },
          json: true,
        };

        request.get(options, (error, response, body) => {
          console.log(body);
        });

        res.redirect(
          `/#${querystring.stringify({
            accessToken,
            refreshToken,
          })}`
        );
      } else {
        res.redirect(
          `/#${querystring.stringify({
            error: 'invalid_token',
          })}`
        );
      }
    });
  }
};

const refreshAccessToken = (req, res) => {
  const { refresh_token: refreshToken } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token: accessToken } = body;

      res.send({
        access_token: accessToken,
      });
    }
  });
};

module.exports = {
  login,
  authCallback,
  refreshAccessToken,
};
