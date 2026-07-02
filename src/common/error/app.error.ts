import { HttpException } from '@nestjs/common';
import { errorRegistry } from './error.registry';
import { ErrorDefinition } from './interfaces';

/**
 * Clase única para todos los errores de la aplicación
 */
export class AppError extends HttpException {
  constructor(
    public readonly code: string,
    public readonly params?: Record<string, any>,
  ) {
    const errorDefinition: ErrorDefinition | undefined =
      errorRegistry.getDefinition(code);
    const message = errorDefinition
      ? errorRegistry.getMessage(code)
      : `Unregistered error code: ${code}`;
    const codeStatus = errorDefinition ? errorDefinition.statusCode : 500;
    super(message, codeStatus);
  }

  /**
   * Helper method para crear el error con parámetros
   */
  static throw(code: string, params?: Record<string, any>): never {
    throw new AppError(code, params);
  }
}
