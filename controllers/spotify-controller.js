const axios = require('axios');

const getProfileData = async (req, res, next) => {
  const { access_token: accessToken } = req.cookies;

  try {
    const meOptions = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const meResponse = await axios(meOptions);
    if (meResponse.status !== 200) {
      return next(Error(`Can't get profile data: ${meResponse.data}`));
    }

    return res.json(meResponse.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getProfileData,
};
