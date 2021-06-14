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

module.exports = {
  generateRandomString,
  getActiveScope,
};
