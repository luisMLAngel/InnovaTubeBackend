import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const langHeader =
      req.headers['x-language'] || req.headers['accept-language'];

    req['language'] = this.resolveLanguage(langHeader as string);

    next();
  }

  private resolveLanguage(header?: string): 'es' | 'en' {
    if (!header) return 'en';

    if (header.startsWith('es')) return 'es';
    if (header.startsWith('en')) return 'en';

    return 'en';
  }
}
