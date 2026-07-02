import {
  ErrorDefinition,
  ErrorDomainDefinitions,
  ErrorRegistration,
  ErrorTranslations,
} from './interfaces';

/**
 * Registro centralizado de todos los errores de la aplicación
 * Cada módulo puede registrar sus propios errores usando registerErrors()
 */
class ErrorRegistry {
  private definitions = new Map<string, ErrorDefinition>();
  private translations = new Map<string, ErrorTranslations>();

  /**
   * Mapa de códigos de error a sus definiciones
   * {
   *  'CLIENT_NOT_FOUND': { code: 'CLIENT_NOT_FOUND', defaultMessage: 'Client not found', ... },
   * }...
   *
   */

  /**
   * Registra los errores de un módulo
   * @param registration Objeto con definiciones y traducciones del módulo
   */
  registerErrors(registration: ErrorRegistration): void {
    // Registrar definiciones de cada dominio
    const definitions = registration.definitions; // 'CLIENT_NOT_FOUND' => { ... }
    Object.values(definitions).forEach((def: ErrorDefinition) => {
      this.definitions.set(def.code, def);
    });

    // Registrar traducciones
    Object.entries(registration.translations).forEach(([lang, messages]) => {
      if (!this.translations.has(lang)) {
        this.translations.set(lang, {});
      }
      const langTranslations = this.translations.get(lang)!;
      Object.assign(langTranslations, messages);
    });
  }

  /**
   * Obtiene la definición de un error por su código
   */
  getDefinition(code: string): ErrorDefinition | undefined {
    return this.definitions.get(code);
  }

  /**
   * Obtiene el mensaje traducido de un error
   */
  getMessage(code: string, lang: string = 'en'): string {
    const langTranslations = this.translations.get(lang);
    if (langTranslations && langTranslations[code]) {
      return langTranslations[code];
    }

    // Fallback al mensaje por defecto
    const definition = this.getDefinition(code);
    return definition?.defaultMessage || 'Unknown error';
  }

  /**
   * Verifica si un código de error está registrado
   */
  hasError(code: string): boolean {
    return this.definitions.has(code);
  }
}

// Exportar una instancia singleton
export const errorRegistry = new ErrorRegistry();
