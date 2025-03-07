import { Logger, ILogger, LogLevel } from "shared/Util/Logger";

export default class LoggerFactory {
	private static logs: Map<LogLevel, Logger> = new Map<LogLevel, Logger>();

	public static getLogger(logLevel: LogLevel = LogLevel.Debug): ILogger {
		if (this.logs.has(logLevel)) {
			return LoggerFactory.logs.get(logLevel) as ILogger;
		} else {
			const logger = new Logger(logLevel);
			LoggerFactory.logs.set(logLevel, logger);
			return logger;
		}
	}
}

export { LogLevel };
