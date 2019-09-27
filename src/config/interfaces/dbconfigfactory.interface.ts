import { AbstractDbConfig } from '../configurations/abstract.config';

export interface DbConfigFactory {
  makeDbConfig(): AbstractDbConfig;
}
