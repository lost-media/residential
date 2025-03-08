/* Logger
 * Function: Broadcast meaningful, formatted messages
 */

import { RunService } from "@rbxts/services";

export enum LogLevel {
	Debug = 0,
	Info = 1,
	Warning = 2,
	Error = 3,
}

export function logLevelToString(logLevel: LogLevel): string {
	switch (logLevel) {
		case LogLevel.Debug:
			return "DEBUG";
		case LogLevel.Info:
			return "INFO";
		case LogLevel.Warning:
			return "WARNING";
		case LogLevel.Error:
			return "ERROR";
		default:
			return "LOG";
	}
}

export interface ILogger {
	log(message: string, logLevel: LogLevel, scope?: string): void;
	format(message: string, logLevel: LogLevel, scope?: string): string;
}

export class Logger implements ILogger {
	private logLevel: LogLevel;

	constructor(logLevel: LogLevel) {
		this.logLevel = logLevel;
	}

	public log(message: string, logLevel: LogLevel = LogLevel.Debug, scope: string = "lm-engine"): void {
		if (logLevel >= this.logLevel) {
			print(this.format(message, logLevel, scope));
		}
	}

	public format(message: string, logLevel: LogLevel, scope: string = "lm-engine"): string {
		const logString = logLevelToString(logLevel);

		return `[${scope}] - [${RunService.IsClient() ? "CLIENT" : "SERVER"}] - ${logString} - ${message}`;
	}
}
