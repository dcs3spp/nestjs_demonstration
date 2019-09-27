import { DbConfigFactory } from '../interfaces/dbconfigfactory.interface';
import { AbstractDbConfig } from '../configurations/abstract.config';
import { EnvironmentConfig } from '../configurations/environment.config';

export class EnvironmentConfigFactory implements DbConfigFactory {
  public makeDbConfig(): AbstractDbConfig {
    const config: EnvironmentConfig = new EnvironmentConfig();
    config.validate();

    return config;
  }
}
