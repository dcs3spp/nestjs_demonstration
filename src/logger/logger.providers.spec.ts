import { createLoggerProviders } from './logger.providers';
import { LoggerOptions } from './logger.interfaces';
import { Provider, LogLevel } from '@nestjs/common';
import { LoggingService } from './logger.service';
import { LOGGER_OPTIONS } from './logger.constants';

describe('-- Logging Module Providers --', () => {
  const logLevel: LogLevel = 'debug';
  const logOptions: LoggerOptions = {
    level: logLevel,
    silent: true,
  };

  afterAll(() => {
    jest.resetModules();
  });

  test('providers array created', () => {
    const providers: Provider[] = createLoggerProviders(logOptions);
    expect(providers).toHaveLength(2);
    expect(providers[0]).toBeDefined();
    expect(providers[1]).toEqual({
      provide: LOGGER_OPTIONS,
      useValue: logOptions,
    });
  });

  test('existing instance returned of logging service', () => {
    const providers: Provider[] = createLoggerProviders(logOptions);
    expect(providers).toHaveLength(2);
    expect(providers[0]).toBeDefined();
    expect(providers[1]).toEqual({
      provide: LOGGER_OPTIONS,
      useValue: logOptions,
    });

    const service: any = providers[0];
    const first: LoggingService = service.useFactory(logOptions);
    expect(first).toBeInstanceOf(LoggingService);
  });
});
