import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from '../config.constants';
import { AbstractDbConfig } from './abstract.config';
import { EnvConfig } from '../interfaces/envconfig.interface';

export class EnvironmentConfig extends AbstractDbConfig {
  constructor() {
    super();
  }

  protected load(): EnvConfig {
    const envConfig: EnvConfig = {};
    envConfig[DB_HOST] = process.env.DB_HOST;
    envConfig[DB_NAME] = process.env.DB_NAME;
    envConfig[DB_PASSWORD] = process.env.DB_PASSWORD;
    envConfig[DB_PORT] = process.env.DB_PORT;
    envConfig[DB_SCHEMA] = process.env.DB_SCHEMA;
    envConfig[DB_USER] = process.env.DB_USER;

    return envConfig;
  }
}
