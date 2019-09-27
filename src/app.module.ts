import {
  Logger,
  Module,
  DynamicModule,
  Type,
  ForwardReference,
  OnApplicationShutdown,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationOptions } from './app.interfaces';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CourseModule } from './course/course.module';
import { LoggerModule } from './logger/logger.module';
import { SeedModule } from './database/seed/seed.module';

@Module({})
export class AppModule implements OnApplicationShutdown {
  public onApplicationShutdown(signal?: string): void {
    if (signal) {
      Logger.log(`AppModule => Received signal ${signal}`);
    }
    Logger.log('AppModule => Shutting down...');
  }

  public static forRoot(appOptions: ApplicationOptions): DynamicModule {
    const importsArr: Array<
      DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>
    > = [
      ConfigModule,
      CourseModule,
      LoggerModule.forRoot(appOptions.loggingOptions),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useExisting: ConfigService,
      }),
    ];

    if (appOptions.seedData) {
      importsArr.push(SeedModule);
    }

    return {
      module: AppModule,
      imports: importsArr,
      providers: [AppService],
      controllers: [AppController],
    };
  }
}
