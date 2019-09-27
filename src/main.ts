import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';

import { AppModule } from './app.module';
import { ApplicationOptions } from './app.interfaces';
import { INestApplication } from '@nestjs/common';
import { LoggingService } from './logger/logger.service';

declare const module: any;

async function bootstrap(): Promise<void> {
  let app: INestApplication;
  let logger: LoggingService;

  const nonProductionEnvironment: boolean =
    process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

  try {
    const appOptions: ApplicationOptions = {
      loggingOptions: {
        level: nonProductionEnvironment ? 'debug' : 'info',
        silent: process.env.NODE_ENV === 'test' ? true : false,
      },
      seedData: nonProductionEnvironment,
    };

    app = await NestFactory.create(AppModule.forRoot(appOptions), {
      logger: false,
    });

    logger = app.get(LoggingService);
    app.useLogger(app.get(LoggingService));
    logger.info(`Initialised application with process id ${process.pid}`);
  } catch (err) {
    process.stderr.write(
      `Error encountered while bootstrapping application ${err}`,
    );
    if (err instanceof Error) {
      process.stderr.write(`${err.message}\n`);
      process.stderr.write(`${err.stack}\n`);
      if (app) {
        app.close();
      }
    }
  }

  logger.info('Creating swagger document...');
  const options = new DocumentBuilder()
    .setTitle('Courses example')
    .setDescription('The courses API description')
    .setVersion('1.0')
    .addTag('courses')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  logger.info('Enabling shutdown hooks...');
  const signals: ShutdownSignal[] = [
    ShutdownSignal.SIGABRT,
    ShutdownSignal.SIGBUS,
    ShutdownSignal.SIGFPE,
    ShutdownSignal.SIGHUP,
    ShutdownSignal.SIGILL,
    ShutdownSignal.SIGINT,
    ShutdownSignal.SIGQUIT,
    ShutdownSignal.SIGSEGV,
    ShutdownSignal.SIGTERM,
    ShutdownSignal.SIGTRAP,
    ShutdownSignal.SIGUSR2,
  ];
  app.enableShutdownHooks(signals);

  logger.info('Listening on port 3000...');
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
