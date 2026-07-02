import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const langHeader =
      req.headers['x-language'] || req.headers['accept-language'];

    req.language = this.resolveLanguage(langHeader);

    return next.handle();
  }

  private resolveLanguage(header?: string): 'es' | 'en' {
    if (!header) return 'es';

    if (header.startsWith('es')) return 'es';
    if (header.startsWith('en')) return 'en';

    return 'es';
  }
}
