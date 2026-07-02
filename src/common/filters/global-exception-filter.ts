import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from '../error/app.error';
import { errorRegistry } from '../error/error.registry';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const lang = req.language ?? 'en';

    // Manejo de AppError
    if (exception instanceof AppError) {
      const definition = errorRegistry.getDefinition(exception.code);

      if (!definition) {
        // Error code no registrado
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'UNREGISTERED_ERROR',
          message:
            lang === 'en'
              ? `Unregistered error: ${exception.code}`
              : `Error no registrado: ${exception.code}`,
        });
      }

      const message = errorRegistry.getMessage(exception.code, lang);

      return res.status(definition.statusCode).json({
        statusCode: definition.statusCode,
        errorCode: exception.code,
        message,
        ...(exception.params && { params: exception.params }),
      });
    }

    // Manejo de HttpException (excepciones estándar de NestJS)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return res.status(status).json({
        statusCode: status,
        errorCode: `HTTP_${status}`,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exception.message,
      });
    }

    // Errores no controlados
    console.error('Unhandled error:', exception);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message:
        lang === 'en' ? 'Internal server error' : 'Error interno del servidor',
    });
  }
}
