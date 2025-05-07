import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: string, trace?: string) {
    return level === 'error'
      ? JSON.stringify({ level, message, trace })
      : JSON.stringify({ level, message });
  }

  log(message: string) {
    console.log(this.formatMessage('log', message));
  }

  error(message: string, trace: string) {
    console.error(this.formatMessage('error', message, trace));
  }

  warn(message: string) {
    console.warn(this.formatMessage('warn', message));
  }

  debug(message: string) {
    console.debug(this.formatMessage('debug', message));
  }

  verbose(message: string) {
    console.info(this.formatMessage('verbose', message));
  }
}
