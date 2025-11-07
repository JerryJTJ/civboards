import { ERROR_CODES } from "./errorCodes";
import { PostgrestError } from "@supabase/supabase-js";

//Error Handling
export class AppError extends Error {
	status: number;
	code: string;
	constructor(message: string, status: number, code: string) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

// PostGres Error Codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
export class DatabaseError extends AppError {
	databaseDetails: string;
	databaseMessage: string;
	databaseCode: string;

	constructor(message: string, error: PostgrestError | undefined) {
		super(message, 400, ERROR_CODES.DATABASE.INVALID_QUERY);
		this.databaseDetails = error?.details ?? "";
		this.databaseMessage = error?.message ?? "";
		this.databaseCode = error?.code ?? "";
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 422, ERROR_CODES.VALIDATION);
	}
}

export class NotFoundError extends AppError {
	constructor(message?: string) {
		super(
			message ?? "Resource not found",
			404,
			ERROR_CODES.DATABASE.NOT_FOUND
		);
	}
}

export class ParseError extends AppError {
	constructor(message?: string) {
		super(message ?? "Failed to parse file", 400, ERROR_CODES.PARSE.FAILED);
	}
}
