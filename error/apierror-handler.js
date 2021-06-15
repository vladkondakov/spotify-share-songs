function apiErrorHandler(err, req, res, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  return res.status(err.statusCode).json({
    message: err.message,
  });
}

module.exports = apiErrorHandler;
