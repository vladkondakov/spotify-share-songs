const router = require('express').Router();
const SpotifyAuth = require('../controllers/spotify-auth-controller.js');
const SpotifyController = require('../controllers/spotify-user-controller.js');

router.get('/login', SpotifyAuth.login);
router.get('/authCallback', SpotifyAuth.authCallback);
router.get('/refreshToken', SpotifyAuth.refreshAccessToken);

router.get('/profile', SpotifyController.getProfileData);

module.exports = router;
