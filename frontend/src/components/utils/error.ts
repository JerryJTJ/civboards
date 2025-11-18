export class ValidateFormError extends Error {
	constructor(message?: string) {
		super(message ?? "Failed to validate");
	}
}
