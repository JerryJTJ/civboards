export class ValidationError extends Error {
	constructor(message?: string) {
		super(message ?? "Failed to validate");
	}
}
