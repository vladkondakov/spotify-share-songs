const axios = require('axios');
const { spotifyErrorMapper } = require('../../helpers/mappers.js');

class SpotifyUserService {
  getProfile = async (token) => {
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const spotifyResponse = await axios(options);
      return spotifyResponse.data;
    } catch (err) {
      throw spotifyErrorMapper(err);
    }
  };
}

module.exports = new SpotifyUserService();
