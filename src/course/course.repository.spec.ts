import {
  createConnection,
  getConnection,
  ConnectionOptions,
  getCustomRepository,
  Connection,
} from 'typeorm';

import { CourseRepository } from './course.repository';
import { ConfigOptions } from 'src/config/models/config.options';
import { ConfigServiceFactory } from '../config/factories/configservice.factory';
import { LoggerLevel } from '../logger/logger.types';
import { LoggingService } from '../logger/logger.service';

describe('-- Course Repository--', () => {
  const logLevel: LoggerLevel = 'debug';
  const loggerService: LoggingService = new LoggingService({
    level: logLevel,
    silent: true,
  });

  const configOptions: ConfigOptions = ConfigServiceFactory.loadDbConfigSync() as ConfigOptions;

  afterAll(() => {
    try {
      jest.resetModules();
    } catch (err) {
      loggerService.debug(`afterAll() => ${err}`);
    } finally {
      loggerService.onModuleDestroy();
      const conn: Connection = getConnection();
      if (conn) {
        conn.close();
      }
    }
  });

  beforeAll(async () => {
    const options: ConnectionOptions = configOptions.db as ConnectionOptions;
    await createConnection(options);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should be defined', async () => {
    const repo: CourseRepository = await getCustomRepository(CourseRepository);
    expect(repo).toBeDefined();
  });
});
