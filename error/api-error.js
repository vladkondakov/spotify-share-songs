module.exports = class ApiError extends Error {
  status;

  errors;

  errorResource;

  constructor(status, message, errors = [], errorResource = 'api') {
    super(message);
    this.status = status;
    this.errors = errors;
    this.errorResource = errorResource;
  }

  static BadRequest(message, errors = [], errorResource = 'api') {
    return new ApiError(400, message, errors, errorResource);
  }

  static Unauthorized(message = 'User is unauthorized.', errors = [], errorResource = 'api') {
    return new ApiError(401, message, errors, errorResource);
  }

  static Forbidden(message, errors = [], errorResource = 'api') {
    return new ApiError(403, message, errors, errorResource);
  }

  static NotFound(message, errors = [], errorResource = 'api') {
    return new ApiError(404, message, errors, errorResource);
  }

  static Gone(
    message = 'The requested resource is no longer available.',
    errors = [],
    errorResource = 'api'
  ) {
    return new ApiError(410, message, errors, errorResource);
  }

  static TooManyRequests(message, errors = [], errorResource = 'api') {
    return new ApiError(429, message, errors, errorResource);
  }

  static InternalServerError(message, errors = [], errorResource = 'api') {
    return new ApiError(500, message, errors, errorResource);
  }

  static BadGateWay(message, errors = [], errorResource = 'api') {
    return new ApiError(502, message, errors, errorResource);
  }

  static ServiceUnavailable(message, errors = [], errorResource = 'api') {
    return new ApiError(503, message, errors, errorResource);
  }
};
