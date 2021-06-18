const router = require('express').Router();
const userController = require('../controllers/user-controller.js');

router.get('/activate/:link', userController.activateByLink);
router.get('/refresh', userController.refreshToken);
router.get('/users', userController.getUsers);
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
