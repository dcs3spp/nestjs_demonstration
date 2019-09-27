import * as Joi from '@hapi/joi';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from '../config.constants';
import { EnvConfig } from '../interfaces/envconfig.interface';
import Course from '../../course/course.entity';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';

export abstract class AbstractDbConfig
  implements PostgresConnectionOptions, TypeOrmModuleAsyncOptions {
  /**
   * Static
   */

  // use joi library to prepare a validation schema for env vars
  protected static validationSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid(['development', 'production', 'test'])
      .default('development'),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_SCHEMA: Joi.string().required(),
    DB_USER: Joi.required(),
  });

  /**
   * Interface
   */

  cli: PostgresConnectionOptions['cli'];
  database: string;
  dropSchema: boolean;
  // tslint:disable-next-line
  entities: Array<Function | string | EntitySchema<any>>;
  host: string;
  logging: boolean;
  // tslint:disable-next-line
  migrations: Array<Function | string>;
  migrationsRun: boolean;
  name: string;
  password: string;
  port: number;
  schema: string;
  synchronize: boolean;
  readonly type: 'postgres';
  username: string;

  /**
   * Constructor
   */

  constructor() {
    this.cli = {
      entitiesDir: 'src/course',
      migrationsDir: 'src/database/migrations',
    };
    this.dropSchema = false;
    this.entities = [Course];
    this.logging = false;

    this.migrations = [
      'dist/database/migrations/**/*.js',
      '../../../src/database/migrations/**/*.ts',
    ];
    this.migrationsRun = true;
    this.name = 'default';
    this.synchronize = false;
    this.type = 'postgres';
  }

  /**
   * Methods
   */

  /**
   * Override to prepare map of environment variables
   * from process.env or from .env file
   */
  protected abstract load(): EnvConfig;

  /**
   * Validate expected environment variables are set
   */
  public validate(): void {
    const envConfig: EnvConfig = this.load(); // create a map of the env vars

    // validate
    const { error, value: validatedConfig } = Joi.validate(
      envConfig,
      AbstractDbConfig.validationSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    // initialise properties with validated environment variables
    this.database = validatedConfig[DB_NAME];
    this.host = validatedConfig[DB_HOST];
    this.password = validatedConfig[DB_PASSWORD];
    this.port = Number(validatedConfig[DB_PORT]);
    this.schema = validatedConfig[DB_SCHEMA];
    this.username = validatedConfig[DB_USER];
  }
}
