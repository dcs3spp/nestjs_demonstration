const logger = {
  configure: jest.fn(),
  close: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  silly: jest.fn(),
  transports: ['jest.fn()'],
  verbose: jest.fn(),
  warn: jest.fn(),
};

const winstonMock = {
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue(logger),
  transports: {
    Console: jest.fn(),
  },
};

import * as winston from 'winston';

import { alignColorsAndTime } from '../logger/logger.constants';
import { LoggingService } from '../logger/logger.service';
import { LoggerLevel } from './logger.types';

jest.mock('winston', () => winstonMock);

describe('-- Logging Service --', () => {
  const defaultContextName = 'DEFAULT';
  let loggingService: LoggingService;

  const winstonLoggerOptions: winston.LoggerOptions = {
    exitOnError: true,
    level: 'debug',
    format: alignColorsAndTime,
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
    ],
  };

  afterAll(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const logLevel: LoggerLevel = 'debug';
    loggingService = new LoggingService({ level: logLevel, silent: true });
  });

  test('should be defined when constructed', () => {
    expect(loggingService).toBeInstanceOf(LoggingService);
    expect(loggingService).toBeDefined();
    expect(winstonMock.createLogger).toHaveBeenCalledWith(winstonLoggerOptions);
  });

  test('debug should log a console message at debug level', () => {
    const message = 'debug message sent from test';

    loggingService.debug(message);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
      },
    });
  });

  test('error should log a console message at error level', () => {
    const message = 'error message sent from test';
    const trace = 'trace';

    loggingService.error(message, trace);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
        stackTrace: 'trace',
      },
    });
  });

  test('log should log a console message info level', () => {
    const message = 'info message sent from test';

    loggingService.log(message);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
      },
    });
  });

  test('silly should log a console message at silly level', () => {
    const message = 'silly message sent from test';

    loggingService.silly(message);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.silly).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
      },
    });
  });

  test('verbose should log a console message at verbose level', () => {
    const message = 'verbose message sent from test';

    loggingService.verbose(message);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.verbose).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
      },
    });
  });

  test('warn should log a console message at warn level', () => {
    const message = 'warn message sent from test';

    loggingService.warn(message);
    expect(winstonMock.createLogger).toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(message, {
      meta: {
        context: defaultContextName,
      },
    });
  });

  test('property setter ContextName should set contextName member variable', () => {
    const contextName = 'myContext';

    loggingService.ContextName = contextName;
    expect(loggingService.ContextName).toEqual(contextName);
  });

  test('context meta data updated on log method call after using ContextName property setter', () => {
    const updatedContextName = 'myNewContext';
    const message = 'warn message after updated context meta data';

    loggingService.ContextName = updatedContextName;
    expect(loggingService.ContextName).toEqual(updatedContextName);

    loggingService.warn(message);
    expect(logger.warn).toHaveBeenCalledWith(message, {
      meta: {
        context: updatedContextName,
      },
    });
  });

  test('onModuleDestroy should close logger', () => {
    loggingService.onModuleDestroy();
    expect(logger.close).toHaveBeenCalledTimes(1);
  });

  test('onModuleDestroy should not try to close logger if there are no transports', () => {
    const logLevel: LoggerLevel = 'debug';
    loggingService = new LoggingService({ level: logLevel, silent: true });
    logger.transports.pop();
    loggingService.onModuleDestroy();
    return expect(logger.close).not.toHaveBeenCalled();
  });
});
