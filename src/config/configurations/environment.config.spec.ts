import { EnvironmentConfig } from './environment.config';

describe('-- EnvironmentConfig --', () => {
  const startProcessEnv: NodeJS.ProcessEnv = process.env;
  const production = 'production';

  beforeEach(() => {
    process.env = { ...startProcessEnv };
    delete process.env.NODE_ENV;
  });

  test('it should be defined with default values and db property values to be initially undefined', () => {
    const envConfig: EnvironmentConfig = new EnvironmentConfig();

    expect(envConfig).toBeDefined();
    expect(envConfig.database).toBeUndefined();
    expect(envConfig.host).toBeUndefined();
    expect(envConfig.logging).toBeFalsy();
    expect(envConfig.migrationsRun).toBeTruthy();
    expect(envConfig.name).toEqual('default');
    expect(envConfig.password).toBeUndefined();
    expect(envConfig.port).toBeUndefined();
    expect(envConfig.schema).toBeUndefined();
    expect(envConfig.synchronize).toBeFalsy();
    expect(envConfig.type).toEqual('postgres');
    expect(envConfig.username).toBeUndefined();

    expect(envConfig.cli.entitiesDir).toEqual('src/course');
    expect(envConfig.cli.migrationsDir).toEqual('src/database/migrations');
    expect(envConfig.cli.subscribersDir).toBeUndefined();
    expect(envConfig.entities.length).toEqual(1);
    expect(envConfig.migrations.length).toEqual(2);
  });

  test('validate method should load values from environment variables and set db property values', () => {
    const envConfig: EnvironmentConfig = new EnvironmentConfig();
    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'coursemanagement_live';
    process.env.DB_PASSWORD = 'Password';
    process.env.DB_PORT = '5432';
    process.env.DB_SCHEMA = 'coursemanagement';
    process.env.DB_USER = 'app';
    process.env.NODE_ENV = production;

    envConfig.validate();

    expect(envConfig).toBeDefined();
    expect(envConfig.host).toEqual(process.env.DB_HOST);
    expect(envConfig.database).toEqual(process.env.DB_NAME);
    expect(envConfig.password).toEqual(process.env.DB_PASSWORD);
    expect(envConfig.port).toEqual(Number(process.env.DB_PORT));
    expect(envConfig.schema).toEqual(process.env.DB_SCHEMA);
    expect(envConfig.username).toEqual(process.env.DB_USER);
  });

  test('error thrown when DB_PORT environment variable non numeric', () => {
    const envConfig: EnvironmentConfig = new EnvironmentConfig();

    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'coursemanagement_live';
    process.env.DB_PASSWORD = 'Password';
    process.env.DB_PORT = 'port';
    process.env.DB_SCHEMA = 'coursemanagement';
    process.env.DB_USER = 'app';
    process.env.NODE_ENV = production;

    expect(() => {
      envConfig.validate();
    }).toThrow();
  });

  test('error thrown when required environment variables missing from dotenv file', () => {
    const envConfig: EnvironmentConfig = new EnvironmentConfig();

    process.env.DB_HOST = 'localhost';

    expect(() => {
      envConfig.validate();
    }).toThrow();
  });
});
