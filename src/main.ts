import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const logger = new Logger('App - Innovatube');

  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser()); // Parsear las cookies de las solicitudes entrantes

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = envs.ALLOWED_ORIGINS;

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true, // Permite que se envien cookies entre dominios, o sea frontend y backend
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
    }),
  );

  // app.use((req, res, next) => {
  //   console.log('Incoming request:', req.method, req.url);
  //   next();
  // });

  console.log('Applying GlobalExceptionFilter');
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(envs.PORT, '0.0.0.0');
  logger.log('App running on PORT:' + envs.PORT);
}

bootstrap();
