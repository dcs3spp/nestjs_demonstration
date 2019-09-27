import winston = require('winston');
import { alignColorsAndTime } from '../logger/logger.constants';

describe('-- Logging Service --', () => {
  afterAll(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should be defined when constructed', () => {
    const myCustomLevels = {
      levels: {
        mycustomlogginglevel: 0,
        short: 1,
      },
      colors: {
        mycustomlogginglevel: 'blue',
        short: 'green',
      },
    };
    const logger: any = winston.createLogger({
      levels: myCustomLevels.levels,
      exitOnError: true,
      level: 'mycustomlogginglevel',
      transports: [
        new winston.transports.Console({
          format: alignColorsAndTime,
          handleExceptions: true,
          silent: false,
        }),
      ],
    });
    winston.addColors(myCustomLevels.colors);

    const logMock = jest.spyOn(alignColorsAndTime, 'transform');
    logger.mycustomlogginglevel('test');
    logger.close();
    return expect(logMock).toHaveBeenCalled();
  });

  test('test short padding', () => {
    const myCustomLevels = {
      levels: {
        a: 0,
      },
      colors: {
        a: 'green',
      },
    };
    const logger: any = winston.createLogger({
      levels: myCustomLevels.levels,
      exitOnError: true,
      level: 'a',
      transports: [
        new winston.transports.Console({
          format: alignColorsAndTime,
          handleExceptions: true,
          silent: false,
        }),
      ],
    });
    winston.addColors(myCustomLevels.colors);

    const logMock = jest.spyOn(alignColorsAndTime, 'transform');
    logger.a('test');

    return expect(logMock).toHaveBeenCalled();
  });
});
