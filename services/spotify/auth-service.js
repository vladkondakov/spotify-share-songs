const axios = require('axios');
const querystring = require('querystring');
const SpotifyAuthModel = require('../../models/spotify/spotify-auth-model.js');
const { formError, spotifyErrorMapper } = require('../../helpers/mappers.js');
const {
  SPOTIFY_REDIRECT_URI,
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_AUTHORIZE_URI,
} = require('../../config/config.js');
const { generateRandomString, getActiveScope } = require('../../helpers/helpers.js');

const SPOTIFY_RESOURCE = 'spotify';

class SpotifyAuthService {
  getAuthFlowData = (scope) => {
    const state = generateRandomString(16);
    const activeScope = getActiveScope(scope);
    const redirectUri =
      SPOTIFY_AUTHORIZE_URI +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: activeScope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state,
      });

    return { redirectUri, state, scope: activeScope };
  };

  checkState = (state, storedState) => {
    if (state === null || state !== storedState) {
      const errorData = {
        message: 'state_mismatch',
        status: 400,
      };
      throw formError(errorData, SPOTIFY_RESOURCE);
    }

    return true;
  };

  getAuthData = async (code) => {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    };

    try {
      const spotifyAuthResponse = await axios(authOptions);
      return spotifyAuthResponse.data;
    } catch (err) {
      throw spotifyErrorMapper(err);
    }
  };
}

module.exports = new SpotifyAuthService();
