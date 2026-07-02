import { HttpStatus } from '@nestjs/common';

export interface ErrorDefinition {
  code: string;
  statusCode: HttpStatus;
  defaultMessage: string;
}

export interface ErrorDomainDefinitions {
  [key: string]: ErrorDefinition;
}

export interface ErrorDefinitions {
  [domain: string]: ErrorDomainDefinitions;
}

export interface ErrorTranslations {
  [errorCode: string]: string;
}

export interface TranslationMap {
  [language: string]: ErrorTranslations;
}
