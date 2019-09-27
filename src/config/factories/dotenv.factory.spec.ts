import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AbstractDbConfig } from '../configurations/abstract.config';
import { DotEnvConfigFactory } from './dotenv.factory';

describe('-- DotEnvConfigFactory --', () => {
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
  const invalidFile = 'invalid.env';
  const missingRequiredVariablesFile = 'missing_vars.env';
  const nonNumericPortFile = 'nonNumericPort.env';
  const validFile = 'config.sample.env';

  afterAll(() => {
    jest.resetModules();
  });

  test('it creates a config object with properties initialised from a dotenv file', () => {
    const factory: DotEnvConfigFactory = new DotEnvConfigFactory(validFile);
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

  test('it throws an error when the dotenv file does not exist', () => {
    const factory: DotEnvConfigFactory = new DotEnvConfigFactory(invalidFile);

    expect(() => {
      factory.makeDbConfig();
    }).toThrow();
  });

  test('it throws an error when DB_PORT environment variable is non numeric', () => {
    const factory: DotEnvConfigFactory = new DotEnvConfigFactory(
      nonNumericPortFile,
    );

    expect(() => {
      factory.makeDbConfig();
    }).toThrow();
  });

  test('it throws an error when required environment variable(s) missing from dotenv file', () => {
    const factory: DotEnvConfigFactory = new DotEnvConfigFactory(
      missingRequiredVariablesFile,
    );

    expect(() => {
      factory.makeDbConfig();
    }).toThrow();
  });
});
