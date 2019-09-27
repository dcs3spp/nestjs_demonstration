import {
  Injectable,
  LoggerService,
  OnModuleDestroy,
  Scope,
} from '@nestjs/common';
import { createLogger, Logger as WinstonLogger, transports } from 'winston';

import { alignColorsAndTime } from './logger.constants';
import { LoggerOptions } from './logger.interfaces';

@Injectable({ scope: Scope.DEFAULT })
export class LoggingService implements LoggerService, OnModuleDestroy {
  private contextName = 'DEFAULT';
  private logger: WinstonLogger;

  public constructor(options: LoggerOptions) {
    this.logger = createLogger({
      exitOnError: true,
      level: options.level,
      transports: [
        new transports.Console({
          format: alignColorsAndTime,
          handleExceptions: true,
          silent: options.silent,
        }),
      ],
    });
  }

  public onModuleDestroy(): void {
    this.close();
  }

  public close(): void {
    if (this.logger.transports.length > 0) {
      this.logger.debug('LoggingService::close() closing logger...');
      this.logger.close();
    }
  }

  public get ContextName(): string {
    return this.contextName;
  }

  public set ContextName(value: string) {
    this.contextName = value;
  }

  public debug(message: string): void {
    this.logger.debug(message, {
      meta: {
        context: this.ContextName,
      },
    });
  }

  public error(message: string, trace: string): void {
    this.logger.error(message, {
      meta: {
        context: this.ContextName,
        stackTrace: trace,
      },
    });
  }

  public info(message: string): void {
    this.logger.info(message, {
      meta: {
        context: this.ContextName,
      },
    });
  }

  public log(message: string): void {
    this.info(message);
  }

  public silly(message: string): void {
    this.logger.silly(message, {
      meta: {
        context: this.ContextName,
      },
    });
  }

  public verbose(message: string): void {
    this.logger.verbose(message, {
      meta: {
        context: this.ContextName,
      },
    });
  }

  public warn(message: string): void {
    this.logger.warn(message, {
      meta: {
        context: this.ContextName,
      },
    });
  }
}
