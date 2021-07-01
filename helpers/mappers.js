const ApiError = require('../error/api-error.js');

// spotifyResponse is an axios instance
const spotifyResponseMapper = (spotifyResponse) => {
  const resource = 'spotify';
  const { status } = spotifyResponse;
  const message = spotifyResponse.data?.error?.message || spotifyResponse.data?.error_description;
  const errors = [];

  const responseData = {
    message,
    data: spotifyResponse.data,
    status,
    statusText: spotifyResponse.statusText,
    headers: spotifyResponse.headers,
  };

  if (status >= 400) {
    errors.push(responseData);

    switch (status) {
      case 400:
        throw ApiError.BadRequest(message, errors, resource);
      case 401:
        throw ApiError.Unauthorized(message, errors, resource);
      case 403:
        throw ApiError.Forbidden(message, errors, resource);
      case 404:
        throw ApiError.NotFound(message, errors, resource);
      case 429:
        throw ApiError.TooManyRequests(message, errors, resource);
      case 500:
        throw ApiError.InternalServerError(message, errors, resource);
      case 502:
        throw ApiError.BadGateWay(message, errors, resource);
      case 503:
        throw ApiError.ServiceUnavailable(message, errors, resource);
      default:
        throw ApiError.InternalServerError(message, errors, resource);
    }
  } else {
    return responseData;
  }
};

module.exports = { spotifyResponseMapper };
