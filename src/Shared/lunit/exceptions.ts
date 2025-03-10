export interface Exception {
	readonly message: string;

	toString(): string;
}

export class AssertionFailedException implements Exception {
	public readonly message: string;
	public constructor(fallbackMessage: string, message?: string) {
		this.message = fallbackMessage ?? message;
		error(this.toString(), 5);
	}

	public toString(): string {
		return this.message;
	}
}
