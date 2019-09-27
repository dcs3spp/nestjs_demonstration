import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigOptions } from './models/config.options';
import { LoggingService } from '../logger/logger.service';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {
  constructor(
    private logger: LoggingService,
    private options: ConfigOptions = { db: {} },
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    this.logger.debug(
      `TypeOrm configuration => ${JSON.stringify(this.options.db, null, 2)}`,
    );
    return this.options.db as TypeOrmModuleOptions;
  }

  public get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public get isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}
