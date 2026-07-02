import { Module } from '@nestjs/common';

/**
 * Módulo base para el sistema de errores
 * Cada módulo de la aplicación se auto-registra usando OnModuleInit
 * Ya no necesitas modificar este archivo cuando agregues nuevos módulos
 */
@Module({})
export class ErrorModule {}
