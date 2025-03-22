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

const DEFAULT_SCOPE = "lm-engine";

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
	log(message: string, logLevel?: LogLevel, scope?: string): void;
	format(message: string, logLevel: LogLevel, scope?: string): string;
}

export class Logger implements ILogger {
	private logLevel: LogLevel;

	constructor(logLevel: LogLevel) {
		this.logLevel = logLevel;
	}

	public log(message: string, logLevel: LogLevel = LogLevel.Debug, scope: string = DEFAULT_SCOPE): void {
		if (logLevel >= this.logLevel) {
			print(this.format(message, logLevel, scope));
		}
	}

	public format(message: string, logLevel: LogLevel, scope: string = DEFAULT_SCOPE): string {
		const logString = logLevelToString(logLevel);

		return `[${scope}] - [${RunService.IsClient() ? "CLIENT" : "SERVER"}] - ${logString} - ${message}`;
	}
}

export class LoggerWithHistory implements ILogger {
	private logLevel: LogLevel;
	private history: Array<string>;

	constructor(logLevel: LogLevel) {
		this.logLevel = logLevel;
		this.history = new Array<string>();
	}

	public log(message: string, logLevel: LogLevel = LogLevel.Debug, scope: string = DEFAULT_SCOPE): void {
		if (logLevel >= this.logLevel) {
			const formattedMessage = this.format(message, logLevel, scope);
			this.history.push(formattedMessage);
			print(formattedMessage);
		}
	}

	public getHistory(): Array<string> {
		return this.history;
	}

	public clearHistory(): void {
		this.history.clear();
	}

	public format(message: string, logLevel: LogLevel, scope: string = DEFAULT_SCOPE): string {
		const logString = logLevelToString(logLevel);

		return `[${scope}] - [${RunService.IsClient() ? "CLIENT" : "SERVER"}] - ${logString} - ${message}`;
	}
}
