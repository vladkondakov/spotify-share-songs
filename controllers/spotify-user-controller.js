const ApiError = require('../error/api-error.js');
const SpotifyUserService = require('../services/spotify/user-service.js');

const getProfileData = async (req, res, next) => {
  const { access_token: accessToken } = req.query;

  try {
    const profileData = await SpotifyUserService.getProfile(accessToken);
    return profileData;
  } catch (err) {
    if (err instanceof ApiError && err.resource === 'spotify') {
      err.message = "Can't get profile data.";
    }
    return next(err);
  }
};

module.exports = {
  getProfileData,
};
