import { AbstractDbConfig } from '../configurations/abstract.config';
import { DbConfigFactory } from '../interfaces/dbconfigfactory.interface';
import { DotEnvConfig } from '../configurations/dotenv.config';

export class DotEnvConfigFactory implements DbConfigFactory {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  public makeDbConfig(): AbstractDbConfig {
    const config: DotEnvConfig = new DotEnvConfig(this.file);
    config.validate();

    return config;
  }
}
