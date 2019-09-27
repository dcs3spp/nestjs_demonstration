import { AbstractDbConfig } from '../configurations/abstract.config';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from '../config.constants';
import { makeConfig } from './dbconfig.factory';

import dotenv = require('dotenv');
import fs = require('fs');

describe('Config tests', () => {
  const OLD_ENV = process.env;
  const development = 'development';
  const testenv = 'test';
  const production = 'production';
  const devConfig: Map<string, string> = new Map<string, string>();
  const testConfig: Map<string, string> = new Map<string, string>();

  afterEach(() => {
    process.env = OLD_ENV;
  });

  beforeAll(() => {
    const testVars: dotenv.DotenvParseOutput = dotenv.parse(
      fs.readFileSync('test.env'),
    );
    const devVars: dotenv.DotenvParseOutput = dotenv.parse(
      fs.readFileSync('development.env'),
    );

    for (const varName of Object.keys(devVars)) {
      devConfig.set(varName, devVars[varName]);
    }

    for (const varName of Object.keys(testVars)) {
      testConfig.set(varName, testVars[varName]);
    }
  });

  beforeEach(() => {
    jest.resetModules(); // clear the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  describe('Environment factory', () => {
    test('make a valid DbConnectionConfig instance when process.env.NODE_ENV is production', () => {
      process.env.NODE_ENV = production;

      process.env.DB_HOST = 'localhost';
      process.env.DB_NAME = 'coursemanagement_live';
      process.env.DB_PASSWORD = 'Password';
      process.env.DB_PORT = '5432';
      process.env.DB_SCHEMA = 'coursemanagement';
      process.env.DB_USER = 'app';
      process.env.NODE_ENV = production;

      const config: AbstractDbConfig = makeConfig();

      expect(config.database).toEqual(process.env[DB_NAME]);
      expect(config.dropSchema).toEqual(false);
      expect(config.entities).toHaveLength(1);
      expect(config.host).toEqual(process.env[DB_HOST]);
      expect(config.logging).toBe(false);
      expect(config.migrations).toHaveLength(2);
      expect(config.name).toEqual('default');
      expect(config.password).toEqual(process.env[DB_PASSWORD]);
      expect(config.port).toEqual(Number(process.env[DB_PORT]));
      expect(config.schema).toEqual(process.env[DB_SCHEMA]);
      expect(config.synchronize).toBe(false);
      expect(config.type).toEqual('postgres');
      expect(config.username).toEqual(process.env[DB_USER]);
    });
  });

  describe('Dotenv factory', () => {
    test('make a valid DbConnectionConfig instance when process.env.NODE_ENV is development', () => {
      process.env.NODE_ENV = development;

      const config: AbstractDbConfig = makeConfig();

      expect(config.database).toEqual(devConfig.get('DB_NAME'));
      expect(config.dropSchema).toEqual(true);
      expect(config.entities).toHaveLength(1);
      expect(config.host).toEqual(devConfig.get('DB_HOST'));
      expect(config.logging).toBe(false);
      expect(config.migrations).toHaveLength(2);
      expect(config.name).toEqual('default');
      expect(config.password).toEqual(devConfig.get('DB_PASSWORD'));
      expect(config.port).toEqual(Number(devConfig.get('DB_PORT')));
      expect(config.username).toEqual(devConfig.get('DB_USER'));
      expect(config.schema).toEqual(devConfig.get('DB_SCHEMA'));
      expect(config.synchronize).toBe(false);
      expect(config.type).toEqual('postgres');
    });

    test('make a valid DbConnectionConfig instance when process.env.NODE_ENV is test', () => {
      process.env.NODE_ENV = testenv;

      const config: AbstractDbConfig = makeConfig();

      expect(config.database).toEqual(testConfig.get('DB_NAME'));
      expect(config.dropSchema).toEqual(true);
      expect(config.entities).toHaveLength(1);
      expect(config.host).toEqual(testConfig.get('DB_HOST'));
      expect(config.logging).toBe(false);
      expect(config.migrations).toHaveLength(2);
      expect(config.name).toEqual('default');
      expect(config.password).toEqual(testConfig.get('DB_PASSWORD'));
      expect(config.port).toEqual(Number(testConfig.get('DB_PORT')));
      expect(config.username).toEqual(testConfig.get('DB_USER'));
      expect(config.schema).toEqual(testConfig.get('DB_SCHEMA'));
      expect(config.synchronize).toBe(false);
      expect(config.type).toEqual('postgres');
    });
  });

  describe('DbConnectionConfig', () => {
    test('throw an error when missing a required environment variable', () => {
      process.env.NODE_ENV = production;

      process.env.DB_NAME = 'coursemanagement_live';
      process.env.DB_PASSWORD = 'Password';
      process.env.DB_PORT = '5432';
      process.env.DB_SCHEMA = 'coursemanagement';
      process.env.DB_USERNAME = 'app';
      process.env.NODE_ENV = production;

      expect(() => {
        makeConfig();
      }).toThrow();
    });

    test('throw an error when process.env.NODE_ENV is not development, production or test', () => {
      process.env.NODE_ENV = 'undefined';

      expect(() => {
        makeConfig();
      }).toThrow();
    });

    test('throw an error when process.env.NODE_ENV is not defined', () => {
      expect(() => {
        makeConfig();
      }).toThrow();
    });
  });
});
