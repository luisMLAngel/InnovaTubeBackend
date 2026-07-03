import { HttpStatus } from '@nestjs/common';
import {
  ErrorDomainDefinitions,
  ErrorRegistration,
} from '../../../common/error/interfaces';
import { EN, ES } from './translations';

export const USER_ERROR_CODES = {
  USER_NOT_FOUND: 'USER-001',
  EMAIL_ALREADY_EXISTS: 'USER-002',
  USER_WAS_DELETED: 'USER-003',
  ORGANIZATION_ALREADY_SELECTED: 'USER-004',
  ORGANIZATION_NOT_FOUND: 'USER-005',
} as const;

export const USER_ERROR_DEFINITIONS: ErrorDomainDefinitions = {
  [USER_ERROR_CODES.USER_NOT_FOUND]: {
    code: USER_ERROR_CODES.USER_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'User not found',
  },
  [USER_ERROR_CODES.EMAIL_ALREADY_EXISTS]: {
    code: USER_ERROR_CODES.EMAIL_ALREADY_EXISTS,
    statusCode: HttpStatus.CONFLICT,
    defaultMessage: 'User with this email already exists',
  },
  [USER_ERROR_CODES.USER_WAS_DELETED]: {
    code: USER_ERROR_CODES.USER_WAS_DELETED,
    statusCode: HttpStatus.GONE,
    defaultMessage: 'User was deleted',
  },
  [USER_ERROR_CODES.ORGANIZATION_ALREADY_SELECTED]: {
    code: USER_ERROR_CODES.ORGANIZATION_ALREADY_SELECTED,
    statusCode: HttpStatus.FORBIDDEN,
    defaultMessage: 'Organization has already been selected for this user',
  },
  [USER_ERROR_CODES.ORGANIZATION_NOT_FOUND]: {
    code: USER_ERROR_CODES.ORGANIZATION_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'Organization not found',
  },
};

export const USER_ERRORS: ErrorRegistration = {
  definitions: USER_ERROR_DEFINITIONS,
  translations: {
    en: EN,
    es: ES,
  },
};
