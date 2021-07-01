const ApiError = require('../error/api-error.js');

const SPOTIFY_RESOURCE = 'spotify';

const getError = (errorData, apiMessage = '') => {
  const { status, message, resource } = errorData;

  delete errorData.resource;

  const errors = [errorData];
  const errorMessage = apiMessage || message;

  switch (status) {
    case 400:
      return ApiError.BadRequest(errorMessage, errors, resource);
    case 401:
      return ApiError.Unauthorized(errorMessage, errors, resource);
    case 403:
      return ApiError.Forbidden(errorMessage, errors, resource);
    case 404:
      return ApiError.NotFound(errorMessage, errors, resource);
    case 429:
      return ApiError.TooManyRequests(errorMessage, errors, resource);
    case 500:
      return ApiError.InternalServerError(errorMessage, errors, resource);
    case 502:
      return ApiError.BadGateWay(errorMessage, errors, resource);
    case 503:
      return ApiError.ServiceUnavailable(errorMessage, errors, resource);
    default:
      return ApiError.InternalServerError(errorMessage, errors, resource);
  }
};

// message and status are required
const formError = (data, resource) => {
  const errorData = {
    ...data,
    resource,
  };

  const err = getError(errorData);
  return err;
};

const spotifyErrorMapper = (spotifyApiError, apiMessage = '') => {
  const { status, statusText, headers, data } = spotifyApiError.response;
  const message = data?.error?.message || data?.error_description;
  const errorData = {
    message,
    status,
    statusText,
    headers,
    resource: SPOTIFY_RESOURCE,
  };

  const spotifyError = getError(errorData, apiMessage);
  return spotifyError;
};

module.exports = { spotifyErrorMapper, formError };
