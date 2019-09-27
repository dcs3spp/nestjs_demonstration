const fsLibraryMock: typeof jest = jest.mock('fs');

import * as dotenv from 'dotenv';
import { DotEnvConfig } from './dotenv.config';
import { EnvConfig } from '../interfaces/envconfig.interface';

describe('-- DotEnvConfig --', () => {
  const envVars: EnvConfig = {
    DB_HOST: 'localhost',
    DB_NAME: 'database name',
    DB_SCHEMA: 'database schema',
    DB_PASSWORD: 'database password',
    DB_PORT: '5432',
    DB_USER: 'user',
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fsMock: any = require('fs');
  const fsReadSyncOptions = { encoding: 'utf8' };
  const invalidFile = 'invalid.env';
  const missingRequiredVariablesFile = 'missingRequiredVariables.env';
  const nonNumericPortFile = 'nonNumericPort.env';
  const validFile = 'valid.env';
  const testFiles: Map<string, string> = new Map<string, string>([
    [
      validFile,
      `DB_HOST=${envVars.DB_HOST}\n \
          DB_NAME=${envVars.DB_NAME}\n \
          DB_PORT=${envVars.DB_PORT}\n \
          DB_PASSWORD=${envVars.DB_PASSWORD}\n \
          DB_USER=${envVars.DB_USER}\n \
          DB_SCHEMA=${envVars.DB_SCHEMA}\n`,
    ],
    [missingRequiredVariablesFile, `DB_HOST=${envVars.DB_HOST}\n`],
    [
      nonNumericPortFile,
      `DB_HOST=${envVars.DB_HOST}\n \
          DB_NAME=${envVars.DB_NAME}\n \
          DB_PORT=port\n \
          DB_PASSWORD=${envVars.DB_PASSWORD}\n \
          DB_USER=${envVars.DB_USER}\n \
          DB_SCHEMA=${envVars.DB_SCHEMA}\n`,
    ],
  ]);

  afterAll(() => {
    fsLibraryMock.resetAllMocks();
    jest.resetModules();
  });

  beforeAll(() => {
    fsMock.__setMockFiles(testFiles);
  });

  beforeEach(() => {
    fsLibraryMock.clearAllMocks();
  });

  test('it should be defined with default values and db property values to be initially undefined', () => {
    const dotenvConfig: DotEnvConfig = new DotEnvConfig(validFile);

    expect(dotenvConfig).toBeDefined();
    expect(dotenvConfig.database).toBeUndefined();
    expect(dotenvConfig.host).toBeUndefined();
    expect(dotenvConfig.logging).toBeFalsy();
    expect(dotenvConfig.migrationsRun).toBeTruthy(); // running in test.env
    expect(dotenvConfig.name).toEqual('default');
    expect(dotenvConfig.password).toBeUndefined();
    expect(dotenvConfig.port).toBeUndefined();
    expect(dotenvConfig.schema).toBeUndefined();
    expect(dotenvConfig.synchronize).toBeFalsy();
    expect(dotenvConfig.type).toEqual('postgres');
    expect(dotenvConfig.username).toBeUndefined();

    expect(dotenvConfig.cli.entitiesDir).toEqual('src/course');
    expect(dotenvConfig.cli.migrationsDir).toEqual('src/database/migrations');
    expect(dotenvConfig.cli.subscribersDir).toBeUndefined();
    expect(dotenvConfig.entities.length).toEqual(1);
    expect(dotenvConfig.migrations.length).toEqual(2);
  });

  test('validate method should load values from dotenv file and set db property values', () => {
    const dotenvConfig: DotEnvConfig = new DotEnvConfig(validFile);

    expect(dotenvConfig).toBeDefined();

    const fileContent: string = testFiles.get(validFile);
    const parseMock = jest.spyOn(dotenv, 'parse');

    try {
      dotenvConfig.validate();

      expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
      expect(fsMock.readFileSync).toHaveBeenCalledWith(
        validFile,
        fsReadSyncOptions,
      );
      expect(fsMock.readFileSync).toHaveReturnedWith(fileContent);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledWith(fileContent);
      expect(parseMock).toHaveReturnedWith(envVars);
      expect(dotenvConfig.database).toEqual(envVars.DB_NAME);
      expect(dotenvConfig.host).toEqual(envVars.DB_HOST);
      expect(dotenvConfig.password).toEqual(envVars.DB_PASSWORD);
      expect(dotenvConfig.schema).toEqual(envVars.DB_SCHEMA);
      expect(dotenvConfig.username).toEqual(envVars.DB_USER);
      expect(dotenvConfig.port).toEqual(Number(envVars.DB_PORT));
    } finally {
      parseMock.mockRestore();
    }
  });

  test('error thrown when file does not exist', () => {
    const parseMock = jest.spyOn(dotenv, 'parse');

    try {
      const dotenvConfig: DotEnvConfig = new DotEnvConfig(invalidFile);

      expect(dotenvConfig).toBeDefined();
      expect(() => {
        dotenvConfig.validate();
      }).toThrow();
      expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
      expect(fsMock.readFileSync).toHaveBeenCalledWith(
        invalidFile,
        fsReadSyncOptions,
      );
      expect(fsMock.readFileSync).toThrow();
      expect(parseMock).not.toHaveBeenCalled();
    } finally {
      parseMock.mockRestore();
    }
  });

  test('error thrown when DB_PORT environment variable non numeric', () => {
    const expectedParseEnv: EnvConfig = {
      ...envVars,
    };
    const parseMock = jest.spyOn(dotenv, 'parse');
    const fileContent: string = testFiles.get(nonNumericPortFile);

    delete expectedParseEnv.DB_PORT;
    expectedParseEnv.DB_PORT = 'port';

    try {
      const dotenvConfig: DotEnvConfig = new DotEnvConfig(nonNumericPortFile);
      expect(dotenvConfig).toBeDefined();
      expect(() => {
        dotenvConfig.validate();
      }).toThrow();
      expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
      expect(fsMock.readFileSync).toHaveBeenCalledWith(
        nonNumericPortFile,
        fsReadSyncOptions,
      );
      expect(fsMock.readFileSync).toHaveReturnedWith(fileContent);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledWith(fileContent);
      expect(parseMock).toHaveReturnedWith(expectedParseEnv);
    } finally {
      parseMock.mockRestore();
    }
  });

  test('error thrown when required environment variables missing from dotenv file', () => {
    const parseMock = jest.spyOn(dotenv, 'parse');
    const expectedParseEnv: EnvConfig = {
      DB_HOST: 'localhost',
    };
    const fileContent: string = testFiles.get(missingRequiredVariablesFile);
    try {
      const dotenvConfig: DotEnvConfig = new DotEnvConfig(
        missingRequiredVariablesFile,
      );

      expect(dotenvConfig).toBeDefined();
      expect(() => {
        dotenvConfig.validate();
      }).toThrowError();
      expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
      expect(fsMock.readFileSync).toHaveBeenCalledWith(
        missingRequiredVariablesFile,
        fsReadSyncOptions,
      );
      expect(fsMock.readFileSync).toHaveReturnedWith(fileContent);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledWith(fileContent);
      expect(parseMock).toHaveReturnedWith(expectedParseEnv);
    } finally {
      parseMock.mockRestore();
    }
  });
});
