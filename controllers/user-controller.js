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
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_COOKIE_TIME,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  };

  activateByCode = async (req, res, next) => {
    try {
      const { code: activationCode } = req.params;
      await userService.activate(activationCode);

      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      return next(err);
    }
  };

  refreshActivationCode = async (req, res, next) => {
    try {
      const { code: activationCode } = req.params;
      const newCode = await userService.refreshActivationCode(activationCode);

      return res.json({
        code: newCode,
      });
    } catch (err) {
      return next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_COOKIE_TIME,
        httpOnly: true,
      });

      return res.json({ userData });
    } catch (err) {
      return next(err);
    }
  };

  getUsers = async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = new UserController();
