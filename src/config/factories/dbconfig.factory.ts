import { AbstractDbConfig } from '../configurations/abstract.config';
import { DotEnvConfigFactory } from './dotenv.factory';
import { EnvironmentConfigFactory } from './environment.factory';

export function makeConfig(): AbstractDbConfig {
  if (!process.env.NODE_ENV) {
    throw new Error('Environment variable NODE_ENV is not set');
  }

  const development = 'development';
  const production = 'production';
  const test = 'test';

  switch (process.env.NODE_ENV) {
    case development:
    case test: {
      const factory: DotEnvConfigFactory = new DotEnvConfigFactory(
        `${process.env.NODE_ENV}.env`,
      );
      const dbConfig: AbstractDbConfig = factory.makeDbConfig();
      dbConfig.dropSchema =
        process.env.NODE_ENV === test || process.env.NODE_ENV === development;
      return dbConfig;
    }

    case production: {
      const factory: EnvironmentConfigFactory = new EnvironmentConfigFactory();
      return factory.makeDbConfig();
    }

    default: {
      throw new Error(
        `${process.env.NODE_ENV} is not a recognised environment`,
      );
    }
  }
}
