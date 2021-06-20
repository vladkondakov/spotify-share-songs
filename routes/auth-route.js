const router = require('express').Router();
const userController = require('../controllers/user-controller.js');
const validation = require('../middlewares/validation/validation.js');
const authMiddleware = require('../middlewares/auth-middleware.js');

router.get('/activate/:link', userController.activateByLink);
router.get('/refresh', userController.refreshToken);
router.get('/users', authMiddleware, userController.getUsers);
router.post('/registration', validation.validateRegistration, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
