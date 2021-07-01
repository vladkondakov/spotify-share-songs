const router = require('express').Router();
const userController = require('../controllers/user-controller.js');
const validation = require('../middlewares/validation/validation-middleware.js');
const authMiddleware = require('../middlewares/auth-middleware.js');
const activationMiddleware = require('../middlewares/activation-middleware.js');

router.get('/activation/:code', userController.activateByCode); // post, code as a query parameter
router.get('/activation/refresh', authMiddleware, userController.refreshActivationCode);
router.get('/token/refresh', userController.refreshToken);
router.post('/registration', validation.validateRegistration, userController.registration);
router.post('/login', validation.validateLogin, userController.login);
router.post('/logout', userController.logout);
router.get(
  '/reset/password-by-link',
  authMiddleware,
  activationMiddleware,
  userController.requestPasswordReset
);
router.post(
  '/reset/password-by-link',
  validation.validatePasswordReset,
  authMiddleware,
  activationMiddleware,
  userController.passwordResetByToken
);

module.exports = router;
