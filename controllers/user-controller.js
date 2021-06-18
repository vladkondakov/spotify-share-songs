const userService = require('../services/user-service.js');
const config = require('../config/config.js');

class UserController {
  registration = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_COOKIE_TIME,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  };

  login = async (req, res, next) => {
    try {
    } catch (err) {}
  };

  logout = async (req, res, next) => {
    try {
    } catch (err) {}
  };

  activateByLink = async (req, res, next) => {
    try {
    } catch (err) {}
  };

  refreshToken = async (req, res, next) => {
    try {
    } catch (err) {}
  };

  getUsers = async (req, res, next) => {
    try {
      res.json({ message: 'Some message!' });
    } catch (err) {}
  };
}

module.exports = new UserController();
