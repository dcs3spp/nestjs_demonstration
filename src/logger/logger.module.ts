import { Global, Module, DynamicModule } from '@nestjs/common';

import { createLoggerProviders } from './logger.providers';
import { LoggerOptions } from './logger.interfaces';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    const providersArray = createLoggerProviders(options);

    return {
      module: LoggerModule,
      providers: providersArray,
      exports: providersArray,
    };
  }
}
