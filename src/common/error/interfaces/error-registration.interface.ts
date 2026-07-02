import {
  ErrorDomainDefinitions,
  TranslationMap,
} from './error-definition.interface';

export interface ErrorRegistration {
  definitions: ErrorDomainDefinitions;
  translations?: TranslationMap;
}
