/* eslint-disable no-console */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private level: LogLevel;

  constructor() {
    // Set log level based on environment
    const env = process.env.NODE_ENV || 'development';
    this.level = env === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(message: string, ...args: any[]) {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.level >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.level >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.level >= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  // Convenience method for development
  dev(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
