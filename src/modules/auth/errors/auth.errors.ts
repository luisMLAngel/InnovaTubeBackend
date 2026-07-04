import { HttpStatus } from '@nestjs/common';
import {
  ErrorDomainDefinitions,
  ErrorRegistration,
} from '../../../common/error/interfaces';
import { EN, ES } from './translations';

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH-001',
  INVALID_TOKEN: 'AUTH-002',
  INVALID_ORGANIZATION_SELECTION: 'AUTH-003',
  EMAIL_ALREADY_EXISTS: 'AUTH-004',
  USER_NOT_FOUND: 'AUTH-005',
  ORGANIZATION_NOT_FOUND: 'AUTH-006',
  ORGANIZATION_ALREADY_SELECTED: 'AUTH-007',
  REFRESH_TOKEN_NOT_PROVIDED: 'AUTH-008',
  INVALID_REFRESH_TOKEN: 'AUTH-009',
  INVALID_OR_EXPIRED_RESET_TOKEN: 'AUTH-010',
  RECAPTCHA_VALIDATION_ERROR: 'AUTH-011',
} as const;

export const AUTH_ERROR_DEFINITIONS: ErrorDomainDefinitions = {
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: {
    code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    statusCode: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Invalid credentials',
  },
  [AUTH_ERROR_CODES.INVALID_TOKEN]: {
    code: AUTH_ERROR_CODES.INVALID_TOKEN,
    statusCode: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Invalid or expired token',
  },
  [AUTH_ERROR_CODES.INVALID_ORGANIZATION_SELECTION]: {
    code: AUTH_ERROR_CODES.INVALID_ORGANIZATION_SELECTION,
    statusCode: HttpStatus.FORBIDDEN,
    defaultMessage: 'Invalid organization selection',
  },
  [AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS]: {
    code: AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS,
    statusCode: HttpStatus.CONFLICT,
    defaultMessage: 'Email already exists',
  },
  [AUTH_ERROR_CODES.USER_NOT_FOUND]: {
    code: AUTH_ERROR_CODES.USER_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'User not found',
  },
  [AUTH_ERROR_CODES.ORGANIZATION_NOT_FOUND]: {
    code: AUTH_ERROR_CODES.ORGANIZATION_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'Organization not found',
  },
  [AUTH_ERROR_CODES.ORGANIZATION_ALREADY_SELECTED]: {
    code: AUTH_ERROR_CODES.ORGANIZATION_ALREADY_SELECTED,
    statusCode: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Organization already selected',
  },
  [AUTH_ERROR_CODES.REFRESH_TOKEN_NOT_PROVIDED]: {
    code: AUTH_ERROR_CODES.REFRESH_TOKEN_NOT_PROVIDED,
    statusCode: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Refresh token not provided',
  },
  [AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN]: {
    code: AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN,
    statusCode: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Invalid refresh token',
  },
  [AUTH_ERROR_CODES.INVALID_OR_EXPIRED_RESET_TOKEN]: {
    code: AUTH_ERROR_CODES.INVALID_OR_EXPIRED_RESET_TOKEN,
    statusCode: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Invalid reset password token',
  },
  [AUTH_ERROR_CODES.RECAPTCHA_VALIDATION_ERROR]: {
    code: AUTH_ERROR_CODES.RECAPTCHA_VALIDATION_ERROR,
    statusCode: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Invalid recaptch validation',
  },
};

export const AUTH_ERRORS: ErrorRegistration = {
  definitions: AUTH_ERROR_DEFINITIONS,
  translations: {
    en: EN,
    es: ES,
  },
};
