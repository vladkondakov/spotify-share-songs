const router = require('express').Router();
const userController = require('../controllers/user-controller.js');
const validation = require('../validation/validation.js');

router.get('/activate/:link', userController.activateByLink);
router.get('/refresh', userController.refreshToken);
router.get('/users', userController.getUsers);
router.post('/registration', validation.validateRegistration, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
