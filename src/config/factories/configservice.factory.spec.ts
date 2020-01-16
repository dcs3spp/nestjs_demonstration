import dotenv = require('dotenv');
import fs = require('fs');

import { ConfigService } from '../config.service';
import { ConfigServiceFactory } from './configservice.factory';
import { EnvConfig } from '../interfaces//envconfig.interface';
import { LoggingService } from '../../logger/logger.service';

describe('-- ConfigServiceFactory --', () => {
  let environment: EnvConfig;
  const logger: LoggingService = new LoggingService({
    level: 'debug',
    silent: true,
  });
  const productionEnv = 'production';
  const testEnv = 'test';
  const startProcessEnv: NodeJS.ProcessEnv = process.env;

  afterAll(() => {
    jest.resetModules();
  });

  beforeAll(() => {
    let error = false;
    const filename = 'test.env';
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
    } catch (err) {
      error = true;
      throw new Error(
        `Test suite failed to run due to missing ${filename} file`,
      );
    } finally {
      if (error) {
        logger.onModuleDestroy();
      }
    }

    environment = dotenv.parse(fileContent) as EnvConfig;
  });

  beforeEach(() => {
    process.env = { ...startProcessEnv };
    delete process.env.NODE_ENV;
  });

  test('it initialises ConfigService properties from dotenv file asynchronously', async () => {
    process.env.NODE_ENV = testEnv;
    const expectedConnectionName = 'default';
    const service: ConfigService = await ConfigServiceFactory.loadAsync(logger);
    const dbConfig: any = service.createTypeOrmOptions();

    expect.assertions(7);
    expect(dbConfig.name).toEqual(expectedConnectionName);
    expect(dbConfig.database).toEqual(environment.DB_NAME);
    expect(dbConfig.host).toEqual(environment.DB_HOST);
    expect(dbConfig.port).toEqual(Number(environment.DB_PORT));
    expect(dbConfig.schema).toEqual(environment.DB_SCHEMA);
    expect(dbConfig.username).toEqual(environment.DB_USER);
    expect(dbConfig.password).toEqual(environment.DB_PASSWORD);
  });

  test('it loads ConfigOptions from dotenv file synchronously', () => {
    process.env.NODE_ENV = testEnv;

    const expectedConnectionName = 'default';
    const service: ConfigService = ConfigServiceFactory.loadSync(logger);
    const dbConfig: any = service.createTypeOrmOptions();

    expect(dbConfig.name).toEqual(expectedConnectionName);
    expect(dbConfig.database).toEqual(environment.DB_NAME);
    expect(dbConfig.host).toEqual(environment.DB_HOST);
    expect(dbConfig.port).toEqual(Number(environment.DB_PORT));
    expect(dbConfig.schema).toEqual(environment.DB_SCHEMA);
    expect(dbConfig.username).toEqual(environment.DB_USER);
    expect(dbConfig.password).toEqual(environment.DB_PASSWORD);
  });

  test('it loads ConfigOptions from production environment variables asynchronously', async () => {
    const expectedConnectionName = 'default';

    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'database';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_PORT = '5432';
    process.env.DB_SCHEMA = 'myschema';
    process.env.DB_USER = 'username';
    process.env.NODE_ENV = productionEnv;

    const service: ConfigService = await ConfigServiceFactory.loadAsync(logger);
    const dbConfig: any = service.createTypeOrmOptions();

    expect.assertions(7);
    expect(dbConfig.name).toEqual(expectedConnectionName);
    expect(dbConfig.database).toEqual(process.env.DB_NAME);
    expect(dbConfig.host).toEqual(process.env.DB_HOST);
    expect(dbConfig.port).toEqual(Number(process.env.DB_PORT));
    expect(dbConfig.schema).toEqual(process.env.DB_SCHEMA);
    expect(dbConfig.username).toEqual(process.env.DB_USER);
    expect(dbConfig.password).toEqual(process.env.DB_PASSWORD);
  });

  test('it loads ConfigOptions from production environment variables synchronously', () => {
    const expectedConnectionName = 'default';

    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'database';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_PORT = '5432';
    process.env.DB_SCHEMA = 'myschema';
    process.env.DB_USER = 'username';
    process.env.NODE_ENV = productionEnv;

    const service: ConfigService = ConfigServiceFactory.loadSync(logger);
    const dbConfig: any = service.createTypeOrmOptions();

    expect(dbConfig.name).toEqual(expectedConnectionName);
    expect(dbConfig.database).toEqual(process.env.DB_NAME);
    expect(dbConfig.host).toEqual(process.env.DB_HOST);
    expect(dbConfig.port).toEqual(Number(process.env.DB_PORT));
    expect(dbConfig.schema).toEqual(process.env.DB_SCHEMA);
    expect(dbConfig.username).toEqual(process.env.DB_USER);
    expect(dbConfig.password).toEqual(process.env.DB_PASSWORD);
  });

  test('loadDbConfigAsync should throw an error when environment variable missing', async () => {
    const expectedErrorMessage =
      'Config validation error: "DB_NAME" is required';

    process.env.DB_HOST = 'localhost';
    process.env.NODE_ENV = productionEnv;

    expect.assertions(1);
    await expect(ConfigServiceFactory.loadDbConfigAsync()).rejects.toThrow(
      expectedErrorMessage,
    );
  });

  test('loadDbConfigSync should throw an error when envionrment variable missing', () => {
    const expectedErrorMessage =
      'Config validation error: "DB_NAME" is required';

    process.env.DB_HOST = 'localhost';
    process.env.NODE_ENV = productionEnv;

    expect(() => {
      ConfigServiceFactory.loadDbConfigSync();
    }).toThrow(expectedErrorMessage);
  });

  test('loadAsync should throw an error when environment variable missing', async () => {
    const expectedErrorMessage =
      'Config validation error: "DB_NAME" is required';

    process.env.DB_HOST = 'localhost';
    process.env.NODE_ENV = productionEnv;

    await expect(ConfigServiceFactory.loadDbConfigAsync()).rejects.toThrow(
      expectedErrorMessage,
    );
  });

  test('loadSync should throw an error when environment variable missing', () => {
    process.env.DB_HOST = 'localhost';
    process.env.NODE_ENV = productionEnv;

    expect(() => {
      ConfigServiceFactory.loadSync(logger);
    }).toThrow();
  });

  test('it should allow @nestjs/typeorm connections object to be retrieved synchronously', () => {
    process.env.NODE_ENV = testEnv;
    const config: any = ConfigServiceFactory.loadDbConfigSync();
    const expectedConnectionName = 'default';

    expect(config.db.name).toEqual(expectedConnectionName);
    expect(config.db.database).toEqual(environment.DB_NAME);
    expect(config.db.host).toEqual(environment.DB_HOST);
    expect(config.db.port).toEqual(Number(environment.DB_PORT));
    expect(config.db.schema).toEqual(environment.DB_SCHEMA);
    expect(config.db.username).toEqual(environment.DB_USER);
    expect(config.db.password).toEqual(environment.DB_PASSWORD);
  });

  test('it should allow @nestjs/typeorm connections object to be retrieved asynchronously', async () => {
    process.env.NODE_ENV = testEnv;
    const config: any = await ConfigServiceFactory.loadDbConfigAsync();
    const expectedConnectionName = 'default';

    expect(config.db.name).toEqual(expectedConnectionName);
    expect(config.db.database).toEqual(environment.DB_NAME);
    expect(config.db.host).toEqual(environment.DB_HOST);
    expect(config.db.port).toEqual(Number(environment.DB_PORT));
    expect(config.db.schema).toEqual(environment.DB_SCHEMA);
    expect(config.db.username).toEqual(environment.DB_USER);
    expect(config.db.password).toEqual(environment.DB_PASSWORD);
  });
});
