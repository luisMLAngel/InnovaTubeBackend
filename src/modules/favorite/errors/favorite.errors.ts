import { HttpStatus } from '@nestjs/common';
import {
  ErrorDomainDefinitions,
  ErrorRegistration,
} from '../../../common/error/interfaces';
import { EN, ES } from './translations';

export const FAVORITE_ERROR_CODES = {
  VIDEO_NOT_FOUND: 'FAVORITE-001',
} as const;

export const FAVORITE_ERROR_DEFINITIONS: ErrorDomainDefinitions = {
  [FAVORITE_ERROR_CODES.VIDEO_NOT_FOUND]: {
    code: FAVORITE_ERROR_CODES.VIDEO_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'Favorite video not found',
  },
};

export const FAVORITE_ERRORS: ErrorRegistration = {
  definitions: FAVORITE_ERROR_DEFINITIONS,
  translations: {
    en: EN,
    es: ES,
  },
};
