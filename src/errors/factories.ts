import { DomainAttributeError, DomainBadRequestError, DomainInsufficientPermissionsError, DomainInternalServerError, DomainInvalidUserCredentialsError, DomainInvalidClientCredentialsError, DomainAuthenticationRequiredError, DomainNotFoundError, DomainPaymentError, DomainServiceRateLimitError, DomainConflictError, DomainTokenExpiredError, DomainInvalidTokenError, DomainInvalidSignatureError, DomainValidationError, DomainNotImplementedError, DomainUserNotRegisteredError, DomainAwaitingEmailVerificationError, DomainRelatedRecordMissing, DomainServiceUnavailableError } from "./errors";
import { ATTR_ERR_SOURCE } from "./constants";


export function createDomainBadRequestError(detail: string, previous?: Error):DomainBadRequestError {
  return new DomainBadRequestError(detail, previous);
}

export function createDomainInsufficientPermissionsError(detail: string, previous?: Error): DomainInsufficientPermissionsError {
  return new DomainInsufficientPermissionsError(detail, previous);
}

export function createDomainInternalServerError(detail: string, previous?: Error): DomainInternalServerError {
  return new DomainInternalServerError(detail, previous);
}

export function createDomainInvalidUserCredentialsError(detail: string, previous?: Error): DomainInvalidUserCredentialsError {
  return new DomainInvalidUserCredentialsError(detail, previous);
}

export function createDomainInvalidClientCredentialsError(detail: string, previous?: Error): DomainInvalidClientCredentialsError {
  return new DomainInvalidClientCredentialsError(detail, previous);
}

export function createDomainAuthenticationRequiredError(detail: string, previous?: Error): DomainAuthenticationRequiredError {
  return new DomainAuthenticationRequiredError(detail, previous);
}

export function createDomainNotFoundError(detail: string, previous?: Error): DomainNotFoundError {
  return new DomainNotFoundError(detail, previous);
}

export function createDomainPaymentError(detail: string, previous?: Error): DomainPaymentError {
  return new DomainPaymentError(detail, previous);
}

export function createDomainServiceRateLimitError(detail: string, previous?: Error): DomainServiceRateLimitError {
  return new DomainServiceRateLimitError(detail, previous);
}

export function createDomainConflictError(detail: string, previous?: Error): DomainConflictError {
  return new DomainConflictError(detail, previous);
}

export function createDomainTokenExpiredError(detail: string, previous?: Error): DomainTokenExpiredError {
  return new DomainTokenExpiredError(detail, previous);
}

export function createDomainInvalidTokenError(detail: string, previous?: Error): DomainInvalidTokenError {
  return new DomainInvalidTokenError(detail, previous);
}

export function createDomainInvalidSignatureError(detail: string, previous?: Error): DomainInvalidSignatureError {
  return new DomainInvalidSignatureError(detail, previous);
}

export function createDomainValidationError(detail: string, attributeErrors: DomainAttributeError[], previous?: Error): DomainValidationError {
  return new DomainValidationError(detail, attributeErrors, previous);
}

export function createDomainNotImplementedError(detail: string, previous?: Error): DomainNotImplementedError {
  return new DomainNotImplementedError(detail, previous);
}

export function createDomainUserNotRegisteredError(detail: string, previous?: Error): DomainUserNotRegisteredError {
  return new DomainUserNotRegisteredError(detail, previous);
}

export function createDomainAwaitingEmailVerificationError(detail: string, previous?: Error): DomainAwaitingEmailVerificationError {
  return new DomainAwaitingEmailVerificationError(detail, previous);
}

export function createDomainRelatedRecordMissingError(detail: string, previous?: Error): DomainRelatedRecordMissing {
  return new DomainRelatedRecordMissing(detail, previous);
}

export function createDomainServiceUnavailableError(detail: string, previous?: Error): DomainServiceUnavailableError {
  return new DomainServiceUnavailableError(detail, previous);
}

export function createDomainAttributeError(attribute: string, title:string, detail:string, code:string, source?:ATTR_ERR_SOURCE): DomainAttributeError {
  return new DomainAttributeError(attribute, title, detail, code, source);
}
