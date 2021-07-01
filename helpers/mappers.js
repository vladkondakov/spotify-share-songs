const ApiError = require('../error/api-error.js');

const SPOTIFY_RESOURCE = 'spotify';

const spotifyErrorMapper = (spotifyError) => {
  const { status, statusText, headers, data } = spotifyError.response;
  const message = data?.error?.message || data?.error_description;
  const errors = [];

  const errorData = {
    message,
    status,
    statusText,
    headers,
  };

  errors.push(errorData);

  switch (status) {
    case 400:
      return ApiError.BadRequest(message, errors, SPOTIFY_RESOURCE);
    case 401:
      return ApiError.Unauthorized(message, errors, SPOTIFY_RESOURCE);
    case 403:
      return ApiError.Forbidden(message, errors, SPOTIFY_RESOURCE);
    case 404:
      return ApiError.NotFound(message, errors, SPOTIFY_RESOURCE);
    case 429:
      return ApiError.TooManyRequests(message, errors, SPOTIFY_RESOURCE);
    case 500:
      return ApiError.InternalServerError(message, errors, SPOTIFY_RESOURCE);
    case 502:
      return ApiError.BadGateWay(message, errors, SPOTIFY_RESOURCE);
    case 503:
      return ApiError.ServiceUnavailable(message, errors, SPOTIFY_RESOURCE);
    default:
      return ApiError.InternalServerError(message, errors, SPOTIFY_RESOURCE);
  }
};

module.exports = { spotifyErrorMapper };
