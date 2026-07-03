import { HttpStatus } from '@nestjs/common';
import {
  ErrorDomainDefinitions,
  ErrorRegistration,
} from '../../../common/error/interfaces';
import { EN, ES } from './translations';

export const VIDEO_ERROR_CODES = {
  VIDEO_NOT_FOUND: 'VIDEO-001',
} as const;

export const VIDEO_ERROR_DEFINITIONS: ErrorDomainDefinitions = {
  [VIDEO_ERROR_CODES.VIDEO_NOT_FOUND]: {
    code: VIDEO_ERROR_CODES.VIDEO_NOT_FOUND,
    statusCode: HttpStatus.NOT_FOUND,
    defaultMessage: 'Video not found',
  },
};

export const VIDEO_ERRORS: ErrorRegistration = {
  definitions: VIDEO_ERROR_DEFINITIONS,
  translations: {
    en: EN,
    es: ES,
  },
};
