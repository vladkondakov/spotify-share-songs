const ApiError = require('./api-error.js');

function apiErrorHandler(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    message: `Unexpected error: ${err.message}`,
  });
}

module.exports = apiErrorHandler;
