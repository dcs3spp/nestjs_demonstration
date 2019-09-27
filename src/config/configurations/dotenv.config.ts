import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { AbstractDbConfig } from './abstract.config';
import { EnvConfig } from '../interfaces/envconfig.interface';

export class DotEnvConfig extends AbstractDbConfig {
  private file: string;

  constructor(dotEnvFile: string) {
    super();
    this.file = dotEnvFile;
  }

  protected load(): EnvConfig {
    return dotenv.parse(
      fs.readFileSync(this.file, { encoding: 'utf8' }),
    ) as EnvConfig;
  }
}
