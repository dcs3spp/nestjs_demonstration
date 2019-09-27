import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AbstractDbConfig } from '../configurations/abstract.config';
import { EnvironmentConfigFactory } from './environment.factory';

describe('-- EnvironmentConfigFactory --', () => {
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
    port: 5432,
    schema: 'myschema',
    synchronize: false,
    type: 'postgres',
    username: 'username',
  };
  const startProcessEnv: NodeJS.ProcessEnv = process.env;
  const production = 'production';

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    process.env = { ...startProcessEnv };
    delete process.env.NODE_ENV;
  });

  test('it creates a config object with properties initialised from environment variables', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'database';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_PORT = '5432';
    process.env.DB_SCHEMA = 'myschema';
    process.env.DB_USER = 'username';
    process.env.NODE_ENV = production;

    const factory: EnvironmentConfigFactory = new EnvironmentConfigFactory();
    const config: AbstractDbConfig = factory.makeDbConfig();

    expect(config).toBeDefined();
    expect(config.database).toEqual(dbOptionsMock.database);
    expect(config.host).toEqual(dbOptionsMock.host);
    expect(config.logging).toEqual(dbOptionsMock.logging);
    expect(config.migrationsRun).toEqual(dbOptionsMock.migrationsRun);
    expect(config.name).toEqual(dbOptionsMock.name);
    expect(config.password).toEqual(dbOptionsMock.password);
    expect(config.port).toEqual(dbOptionsMock.port);
    expect(config.schema).toEqual(dbOptionsMock.schema);
    expect(config.synchronize).toEqual(dbOptionsMock.synchronize);
    expect(config.type).toEqual(dbOptionsMock.type);
    expect(config.username).toEqual(dbOptionsMock.username);

    expect(config.cli.entitiesDir).toEqual(dbOptionsMock.cli.entitiesDir);
    expect(config.cli.migrationsDir).toEqual(dbOptionsMock.cli.migrationsDir);
    expect(config.cli.subscribersDir).toEqual(dbOptionsMock.cli.subscribersDir);
    expect(config.entities.length).toEqual(1);
    expect(config.migrations.length).toEqual(2);
  });

  test('it throws an error when DB_PORT environment variable is non numeric', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'database';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_PORT = 'port';
    process.env.DB_SCHEMA = 'myschema';
    process.env.DB_USER = 'username';
    process.env.NODE_ENV = production;

    const factory: EnvironmentConfigFactory = new EnvironmentConfigFactory();
    expect(() => {
      factory.makeDbConfig();
    }).toThrow();
  });

  test('it throws an error when required environment variable(s) missing', () => {
    process.env.DB_HOST = 'localhost';
    process.env.NODE_ENV = production;

    const factory: EnvironmentConfigFactory = new EnvironmentConfigFactory();
    expect(() => {
      factory.makeDbConfig();
    }).toThrow();
  });
});
