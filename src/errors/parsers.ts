import { DomainError } from "./errors";
import { ERROR_CODES, ATTR_ERR_SOURCE } from "./constants";
import { createDomainUserNotRegisteredError, createDomainInvalidUserCredentialsError, createDomainInvalidClientCredentialsError, createDomainAuthenticationRequiredError, createDomainInsufficientPermissionsError, createDomainNotFoundError, createDomainPaymentError, createDomainServiceRateLimitError, createDomainServiceUnavailableError, createDomainConflictError, createDomainTokenExpiredError, createDomainInvalidTokenError, createDomainNotImplementedError, createDomainInternalServerError, createDomainInvalidSignatureError, createDomainRelatedRecordMissingError, createDomainAwaitingEmailVerificationError, createDomainAttributeError, createDomainBadRequestError } from "./factories";
import { HTTP_STATUS_CODES } from "../constants";

export function deserializeErrorObject(errorObj: ErrorObject): DomainError {
  const { status, code, title, detail, source } = errorObj;
  switch (code) {
    case ERROR_CODES.EBADREQUEST: {
      return createDomainBadRequestError(detail);
    }
    case ERROR_CODES.EUSERNOTREGISTERED: {
      return createDomainUserNotRegisteredError(detail);
    }
    case ERROR_CODES.EINVALIDUSERCREDENTIALS: {
      return createDomainInvalidUserCredentialsError(detail);
    }
    case ERROR_CODES.EINVALIDCLIENTCREDENTIALS: {
      return createDomainInvalidClientCredentialsError(detail);
    }
    case ERROR_CODES.EAUTHENTICATIONREQUIRED: {
      return createDomainAuthenticationRequiredError(detail);
    }
    case ERROR_CODES.EINSUFFICIENTPERMISSIONS: {
      return createDomainInsufficientPermissionsError(detail);
    }
    case ERROR_CODES.ENOTFOUND: {
      return createDomainNotFoundError(detail);
    }
    case ERROR_CODES.EPAYMENT: {
      return createDomainPaymentError(detail);
    }
    case ERROR_CODES.ERATELIMITEXCEEDED: {
      return createDomainServiceRateLimitError(detail);
    }
    case ERROR_CODES.ESERVICEUNAVAILABLE: {
      return createDomainServiceUnavailableError(detail);
    }
    case ERROR_CODES.ECONFLICT: {
      return createDomainConflictError(detail);
    }
    case ERROR_CODES.ETOKENEXPIRED: {
      return createDomainTokenExpiredError(detail);
    }
    case ERROR_CODES.EINVALIDTOKEN: {
      return createDomainInvalidTokenError(detail);
    }
    case ERROR_CODES.ENOTIMPLEMENTED: {
      return createDomainNotImplementedError(detail);
    }
    case ERROR_CODES.EINTERNALSERVER: {
      return createDomainInternalServerError(detail);
    }
    case ERROR_CODES.EINVALIDSIGNATURE: {
      return createDomainInvalidSignatureError(detail);
    }
    case ERROR_CODES.ERELATEDREQUIRED: {
      return createDomainRelatedRecordMissingError(detail);
    }
    case ERROR_CODES.EEMAILVERIFICATION: {
      return createDomainAwaitingEmailVerificationError(detail);
    }
    default: {
      if (status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
        const parsedAttribute = source?.pointer ?? source?.parameter;
        const parsedSource = !!source?.pointer ? ATTR_ERR_SOURCE.POINTER : ATTR_ERR_SOURCE.PARAMETER;
        return createDomainAttributeError(parsedAttribute!, title, detail, code ?? 'EATTRIBUTE', parsedSource);
      } else {
        return createDomainInternalServerError(detail);
      }
    }
  }
}


export interface SerializedErrorPayload {
  errors: ErrorObject[];
}

export interface ErrorObject {
  status: HTTP_STATUS_CODES;
  code?: string;
  title: string;
  detail: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  stack?: any;
}
