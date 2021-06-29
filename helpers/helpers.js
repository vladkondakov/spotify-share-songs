const config = require('../config/config.js');

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const getActiveScope = (scope) => {
  let activeScope = '';

  scope.forEach((scopeNode) => {
    activeScope += `${scopeNode} `;
  });

  return activeScope.trim();
};

const isExpired = (expiresIn) => Date.now() - expiresIn >= 0;

const getExpiresTime = () => Date.now() + config.ACTIVATION_CODE_TIME;

module.exports = {
  generateRandomString,
  getActiveScope,
  isExpired,
  getExpiresTime,
};
