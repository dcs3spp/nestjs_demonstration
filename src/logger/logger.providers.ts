import { Provider, Scope } from '@nestjs/common';

import { LOGGER_OPTIONS } from './logger.constants';
import { LoggerOptions } from './logger.interfaces';
import { LoggingService } from './logger.service';

export function createLoggerProviders(options: LoggerOptions): Provider[] {
  return [
    {
      provide: LoggingService,
      useFactory: (logOptions: LoggerOptions): LoggingService => {
        return new LoggingService(logOptions);
      },
      inject: [LOGGER_OPTIONS],
      scope: Scope.DEFAULT,
    },
    {
      provide: LOGGER_OPTIONS,
      useValue: options,
    },
  ];
}
