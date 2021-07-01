module.exports = class ApiError extends Error {
  status;

  errors;

  resource;

  constructor(status, message, errors = [], resource = 'api') {
    super(message);
    this.status = status;
    this.errors = errors;
    this.resource = resource;
  }

  static BadRequest(message, errors = [], resource = 'api') {
    return new ApiError(400, message, errors, resource);
  }

  static Unauthorized(message = 'User is unauthorized.', errors = [], resource = 'api') {
    return new ApiError(401, message, errors, resource);
  }

  static Forbidden(message, errors = [], resource = 'api') {
    return new ApiError(403, message, errors, resource);
  }

  static NotFound(message, errors = [], resource = 'api') {
    return new ApiError(404, message, errors, resource);
  }

  static Gone(
    message = 'The requested resource is no longer available.',
    errors = [],
    resource = 'api'
  ) {
    return new ApiError(410, message, errors, resource);
  }

  static TooManyRequests(message, errors = [], resource = 'api') {
    return new ApiError(429, message, errors, resource);
  }

  static InternalServerError(message, errors = [], resource = 'api') {
    return new ApiError(500, message, errors, resource);
  }

  static BadGateWay(message, errors = [], resource = 'api') {
    return new ApiError(502, message, errors, resource);
  }

  static ServiceUnavailable(message, errors = [], resource = 'api') {
    return new ApiError(503, message, errors, resource);
  }
};
