import nodefetch, { FetchError } from 'node-fetch';
import { HTTP_STATUS_CODES } from './constants';

export { FetchError };

export function getFetch(): typeof fetch {
  return <typeof fetch><unknown>nodefetch;
}

export enum HTTP_METHODS {
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PATCH = 'PATCH',
  GET = 'GET',
  DELETE = 'DELETE'
}

export interface HttpRequestOptions {
  headers?: HttpRequestHeaders;
  retry?: {
    interval: number,
    maxAttempts: number
  };
  timeout?: number;
  strictSsl?:boolean;
}

export interface HttpRequestHeaders {
  [key:string]:any;
}

export class HttpResponse {
  constructor(readonly status:HTTP_STATUS_CODES, readonly statusText:string, readonly url:string, readonly body:any, readonly headers:any) {}
}

export class HttpSuccess extends HttpResponse {}

export class HttpError extends HttpResponse {}

/**
 * Adapter Errors
 */

/** Base adapter error */
export class HttpAdapterError extends Error {
  constructor(message:string, readonly previous?:Error) {
    super(message);
    const { constructor } = Object.getPrototypeOf(this);
    this.name = constructor.name;
  }
}

/** Error for timeouts including request-timeout and body-timeout */
export class TimeoutError extends HttpAdapterError {}

/** Host not found. Usually means the server is offline. */
export class HostNotFoundError extends HttpAdapterError {}

/** Any errors involving redirects including no-redirect, max-redirect, unsupported-redirect */
export class RedirectError extends HttpAdapterError {}

/** Any errors relating to the content of the response including max-size and invalid-json */
export class ContentError extends HttpAdapterError {}

/** Parses errors thrown by the adapter and returns a HttpAdapterError */
export const parseAdapterError = (error:Error):Error => {
  if (error instanceof FetchError) {
    switch (error.type) {
      case 'system': {
        if ('ECONNREFUSED' === error.code) {
          return new HostNotFoundError(error.message);
        }
        return error;
      }
      case 'body-timeout':
      case 'request-timeout': {
        return new TimeoutError(error.message);
      }
      case 'no-redirect':
      case 'max-redirect':
      case 'unsupported-redirect': {
        return new RedirectError(error.message);
      }
      case 'max-size':
      case 'invalid-json': {
        return new ContentError(error.message);
      }
    }
  }
  return error;
};

/**
 * Response errors based off the server's response status code.
 */

export class HttpClientError extends HttpError {}

export class HttpServerError extends HttpError {}

export class HttpBadRequestError extends HttpClientError {}

export class HttpUnauthorizedError extends HttpClientError {}

export class HttpForbiddenError extends HttpClientError {}

export class HttpNotFoundError extends HttpClientError {}

export class HttpMethodError extends HttpClientError {}

export class HttpNotAcceptableError extends HttpClientError {}

export class HttpConflictError extends HttpClientError {}

export class HttpUnsupportedError extends HttpClientError {}

export class HttpAttributeError extends HttpClientError {}

export class HttpUnprocessableEntityError extends HttpClientError {}

export class HttpInternalServerError extends HttpServerError {}

export class HttpServiceUnavailableError extends HttpServerError {}

export const parseErrorResponse = (status:HTTP_STATUS_CODES, statusText:string, url:string, body:any, headers:any) => {
  switch (status) {
    case 400:
      return new HttpBadRequestError(status,statusText, url, body, headers);
    case 401:
      return new HttpUnauthorizedError(status,statusText, url, body, headers);
    case 403:
      return new HttpForbiddenError(status,statusText, url, body, headers);
    case 404:
      return new HttpNotFoundError(status,statusText, url, body, headers);
    case 405:
      return new HttpMethodError(status,statusText, url, body, headers);
    case 406:
      return new HttpNotAcceptableError(status,statusText, url, body, headers);
    case 409:
      return new HttpConflictError(status,statusText, url, body, headers);
    case 415:
      return new HttpUnsupportedError(status,statusText, url, body, headers);
    case 422:
      return new HttpUnprocessableEntityError(status,statusText, url, body, headers);
    case 500:
      return new HttpInternalServerError(status,statusText, url, body, headers);
    case 503:
      return new HttpServiceUnavailableError(status,statusText, url, body, headers);
    default:
      return new HttpError(status,statusText, url, body, headers);
  }
};
