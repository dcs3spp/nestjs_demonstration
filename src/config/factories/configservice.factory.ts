import { ConfigOptions } from '../models/config.options';
import { ConfigService } from '../config.service';
import { LoggingService } from '../../logger/logger.service';
import { makeConfig } from './dbconfig.factory';

export class ConfigServiceFactory {
  /**
   * Create ConfigService instance with properties initialised from environment variables
   * @remarks Initialised by dotenv depending upon process.env.NODE_ENV value
   * development = development.env
   * test = test.env
   * production = initialised from environment variables configured on hosting environment
   * @param {LoggingService} logger
   * @returns {Promise<ConfigService>}
   */
  static async loadAsync(logger: LoggingService): Promise<ConfigService> {
    const options: ConfigOptions = await this.loadDbConfigAsync();
    return new ConfigService(logger, options);
  }

  /**
   * Create ConfigService instance synchronously
   * @param {LoggingService} logger
   * @returns {Promise<ConfigService>}
   */
  static loadSync(logger: LoggingService): ConfigService {
    const options: ConfigOptions = this.loadDbConfigSync();
    return new ConfigService(logger, options);
  }

  /**
   * Load config asynchronously
   * @returns {Promise<ConfigOptions>}
   */
  public static async loadDbConfigAsync(): Promise<ConfigOptions> {
    return new Promise((resolve, reject): void => {
      try {
        const options: ConfigOptions = {
          db: makeConfig(),
        };
        resolve(options);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Load config synchronously
   * @returns {ConfigOptions}
   */
  public static loadDbConfigSync(): ConfigOptions {
    return {
      db: makeConfig(),
    };
  }
}
