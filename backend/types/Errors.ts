import { ERROR_CODES } from "./errorCodes";
import { PostgrestError } from "@supabase/supabase-js";

//Error Handling
// PostGres Error Codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
export class AppError extends Error {
	status: number;
	code: string;
	databaseDetails: string;
	databaseMessage: string;
	databaseCode: string;

	constructor(
		message: string,
		status: number,
		code: string,
		databaseDetails?: string,
		databaseMessage?: string,
		databaseCode?: string
	) {
		super(message);
		this.status = status;
		this.code = code;
		// Below is for PostgresErrors
		this.databaseDetails = databaseDetails || "";
		this.databaseMessage = databaseMessage || "";
		this.databaseCode = databaseCode || "";
	}
}

export function throwDatabaseError(message: string, error: PostgrestError) {
	throw new AppError(
		message,
		400,
		ERROR_CODES.DATABASE.INVALID_QUERY,
		error.details,
		error.message,
		error.code
	);
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
