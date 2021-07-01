const router = require('express').Router();
const SpotifyUserController = require('../controllers/spotify-user-controller.js');
const SpotifyAuthController = require('../controllers/spotify-auth-controller.js');
// const authMiddleware = require('../middlewares/auth-middleware.js');

// router.use(authMiddleware);

router.get('/login', SpotifyAuthController.login);
router.get('/authCallback', SpotifyAuthController.authCallback);
router.get('/refreshToken', SpotifyAuthController.refreshAccessToken);

router.get('/profile', SpotifyUserController.getProfileData);

module.exports = router;
