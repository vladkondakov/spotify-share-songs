const axios = require('axios');
const spotifyResponseMapper = require('../helpers/mappers.js');
const ApiError = require('../error/api-error.js');

const getProfileData = async (req, res, next) => {
  const { access_token: accessToken } = req.cookies;

  try {
    const meOptions = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const spotifyResponse = await axios(meOptions);
    const mappedResponse = spotifyResponseMapper(spotifyResponse);

    return res.json(mappedResponse.data);
  } catch (err) {
    if (err instanceof ApiError && err.errorResource === 'spotify') {
      err.message = "Can't get profile data";
    }

    return next(err);
  }
};

module.exports = {
  getProfileData,
};
