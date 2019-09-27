import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Options } from '../interfaces/options.interface';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class ConfigOptions implements Options {
  db: TypeOrmModuleOptions | PostgresConnectionOptions;
}
