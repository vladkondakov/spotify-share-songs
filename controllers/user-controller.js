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
    } catch (err) {
      return next(err);
    }
  };

  activateByLink = async (req, res, next) => {
    try {
      const { link: activationLink } = req.params;
      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      return next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
    } catch (err) {
      return next(err);
    }
  };

  getUsers = async (req, res, next) => {
    try {
      return res.json({ message: 'Some message!' });
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = new UserController();
