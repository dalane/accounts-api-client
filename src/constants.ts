export enum MEDIA_TYPES {
  HTML = 'text/html',
  JSON = 'application/json',
  JSON_API = 'application/vnd.api+json'
}

export enum HTTP_STATUS_CODES {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD = 405,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  UNSUPPORTED = 415,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  /** Redirect but use a GET request */
  SEE_OTHER = 303,
  /** Repeat the request with the same method and body at the given location. This location should only be used for this request. */
  TEMPORARY_REDIRECT = 307,
  /** Repeat the request with the same method and body at the given location. This location should be used for all future requests. */
  PERMANENT_REDIRECT = 308
}

export enum ENVIRONMENT {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
  INTEGRATION = 'integration'
}

export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
