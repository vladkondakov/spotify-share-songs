const ApiError = require('./api-error.js');

function apiErrorHandler(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    const { message, errors, resource, status } = err;

    return res.status(err.status).json({
      message,
      errors,
      resource,
      status,
    });
  }

  return res.status(500).json({
    message: `Unexpected error: ${err.message}`,
  });
}

module.exports = apiErrorHandler;
