/* eslint-disable no-console */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor() {
        // Set log level based on environment
        const env = process.env.NODE_ENV || 'development';
        this.level = env === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    }
    setLevel(level) {
        this.level = level;
    }
    error(message, ...args) {
        if (this.level >= LogLevel.ERROR) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this.level >= LogLevel.WARN) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this.level >= LogLevel.INFO) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }
    debug(message, ...args) {
        if (this.level >= LogLevel.DEBUG) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }
    // Convenience method for development
    dev(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] ${message}`, ...args);
        }
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map