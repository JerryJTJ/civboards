import { ERROR_CODES } from "./errorCodes";

//Error Handling
export class AppError extends Error {
	status: number;
	details: string;
	constructor(message: string, status: number, details: string) {
		super(message);
		this.status = status;
		this.details = details; // Additional validation details
	}
}

export function throwDatabaseError(error) {
	throw new AppError(error.message, 400, ERROR_CODES.DATABASE.INVALID_QUERY);
}

export function throwValidationError(message: string) {
	throw new AppError(message, 422, ERROR_CODES.VALIDATION);
}

export function throwNotFoundError(message?: string) {
	throw new AppError(
		message || "Resource not found",
		404,
		ERROR_CODES.DATABASE.NOT_FOUND
	);
}
