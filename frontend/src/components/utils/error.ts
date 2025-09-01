export class ValidationError extends Error {
	constructor();
	constructor(message: string);

	constructor(message?: string) {
		super(message || "Failed to validate");
	}
}
