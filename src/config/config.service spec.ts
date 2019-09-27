const dbOptionsMock: TypeOrmModuleOptions = {
  cli: {
    entitiesDir: 'src/course',
    migrationsDir: 'src/database/migrations',
  },
  database: 'database',
  entities: [__dirname + '/../course/**/*.entity{.ts,.js}'],
  host: 'localhost',
  logging: false,
  migrations: [__dirname + '/../database/migrations/**/*.{ts,js}'],
  migrationsRun: true,
  name: 'default',
  password: 'password',
  port: 1234,
  schema: 'schema',
  synchronize: false,
  type: 'postgres',
  username: 'username',
};

import { LoggingService } from '../logger/logger.service';
import { ConfigService } from './config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerLevel } from '../logger/logger.types';
import { ConfigServiceFactory } from './factories/configservice.factory';

jest.mock('./factories/dbconfig.factory', () => ({
  makeConfig: jest.fn().mockReturnValue(dbOptionsMock),
  config: dbOptionsMock,
}));

describe('-- Config Service --', () => {
  const development = 'development';
  const oldEnv = process.env;
  const production = 'production';
  const testenv = 'test';
  let logger: LoggingService;
  let config: ConfigService;

  afterAll(() => {
    logger.onModuleDestroy();
    jest.resetModules();
  });

  afterEach(() => {
    process.env = oldEnv;
    jest.clearAllMocks();
  });

  beforeAll(() => {
    const logLevel: LoggerLevel = 'debug';
    logger = new LoggingService({ level: logLevel, silent: true });
  });

  beforeEach(() => {
    process.env = { ...oldEnv };
    delete process.env.NODE_ENV;

    config = ConfigServiceFactory.loadSync(logger);
  });

  test('constructor creates service instance', () => {
    const service: ConfigService = new ConfigService(logger);
    const options: any = service.createTypeOrmOptions();
    expect(service).toBeDefined();
    expect(options.db).toBeUndefined();
  });

  test('isDevelopment returns true when process.env.NODE_ENV == development', () => {
    process.env.NODE_ENV = development;
    expect(config).toBeDefined();
    expect(config.isDevelopment).toBeTruthy();
    expect(config.isProduction).toBeFalsy();
    expect(config.isTest).toBeFalsy();
  });

  test('isProduction returns true when process.env.NODE_ENV == production', () => {
    process.env.NODE_ENV = production;
    expect(config).toBeDefined();
    expect(config.isDevelopment).toBeFalsy();
    expect(config.isProduction).toBeTruthy();
    expect(config.isTest).toBeFalsy();
  });

  test('isTest returns true when process.env.NODE_ENV == test', () => {
    process.env.NODE_ENV = testenv;
    expect(config).toBeDefined();
    expect(config.isDevelopment).toBeFalsy();
    expect(config.isProduction).toBeFalsy();
    expect(config.isTest).toBeTruthy();
  });

  test('createTypeOrmOptions returns typeorm db configuration', () => {
    process.env.NODE_ENV = testenv;

    const options: TypeOrmModuleOptions = config.createTypeOrmOptions();

    expect(config).toBeDefined();
    expect(options).toEqual(dbOptionsMock);
  });
});
