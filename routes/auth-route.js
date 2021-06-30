const router = require('express').Router();
const userController = require('../controllers/user-controller.js');
const validation = require('../middlewares/validation/validation-middleware.js');
const authMiddleware = require('../middlewares/auth-middleware.js');

router.get('/activate/:code', userController.activateByCode);
router.get('/activate/refresh/:code', authMiddleware, userController.refreshActivationCode);
router.get('/token/refresh', userController.refreshToken);
router.get('/users', authMiddleware, userController.getUsers);
router.post('/registration', validation.validateRegistration, userController.registration);
router.post('/login', validation.validateLogin, userController.login);
router.post('/logout', userController.logout);
router.get('/reset/password-by-link', authMiddleware, userController.requestPasswordReset);
router.post(
  '/reset/password-by-link',
  validation.validatePasswordReset,
  authMiddleware,
  userController.resetPasswordByToken
);

module.exports = router;
