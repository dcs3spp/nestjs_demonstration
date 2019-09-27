import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Options {
  db: TypeOrmModuleOptions;
}
