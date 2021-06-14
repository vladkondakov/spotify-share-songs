const router = require('express').Router();
const SpotifyAuth = require('../controllers/spotify-auth-controller.js');

router.route('/login').get(SpotifyAuth.login);

router.route('/authCallback').get(SpotifyAuth.authCallback);

router.route('/refreshToken').get(SpotifyAuth.refreshAccessToken);

module.exports = router;
