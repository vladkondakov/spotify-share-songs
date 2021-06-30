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

  // return something instead of client url
  activateByCode = async (req, res, next) => {
    try {
      const { code: activationCode } = req.params;
      await userService.activate(activationCode);

      return res.status(200).json({ message: 'User was activated' });
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

      return res.json(userData);
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

  requestPasswordReset = async (req, res, next) => {
    try {
      const { email } = req.user;
      const resetData = await userService.requestPasswordReset(email);
      return res.json(resetData);
    } catch (err) {
      return next(err);
    }
  };

  // what is an appropriate http status code
  resetPasswordByToken = async (req, res, next) => {
    try {
      const { token, password } = req.body;
      const { email, userID } = req.user;
      await userService.resetPassword({ token, password, email, userID });
      return res.status(200).end();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = new UserController();
