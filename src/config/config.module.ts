import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LoggingService } from '../logger/logger.service';
import { ConfigServiceFactory } from './factories/configservice.factory';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: (logger: LoggingService): ConfigService => {
        try {
          return ConfigServiceFactory.loadSync(logger);
        } catch (err) {
          if (err instanceof Error) {
            logger.error(
              `ConfigModule::${err}`,
              process.env.NODE_ENV !== 'production'
                ? err.stack
                : 'stack trace hidden',
            );
            throw err;
          }
        }
      },
      inject: [LoggingService],
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
