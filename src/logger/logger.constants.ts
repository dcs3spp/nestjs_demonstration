import { Format } from 'logform';
import { format } from 'winston';

export const LOGGER_OPTIONS = 'logger_options';
export const MAX_PADDING = 17;
export const VERBOSE_LENGTH = 7;

export const alignColorsAndTime: Format = format.combine(
  format.colorize({ all: true }),
  format.label({ label: '[LOGGER]' }),
  format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
  format.printf(info => {
    // strip colour control codes
    let parsedLevel: string = info.level.replace(/\[\d+m/g, '');

    // remove empty characters at start and end of string
    parsedLevel = parsedLevel.slice(1);
    parsedLevel = parsedLevel.slice(0, parsedLevel.length - 1);

    // determine padding length based on string length
    const padding =
      parsedLevel.length <= VERBOSE_LENGTH ? VERBOSE_LENGTH : MAX_PADDING;

    // return formatted log string
    return ` ${info.label}  ${process.pid}  ${
      info.timestamp
    }  ${parsedLevel.padEnd(padding, ' ')} : ${info.message}`;
  }),
);
