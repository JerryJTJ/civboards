import {
	InsufficientScopeError,
	InvalidRequestError,
	InvalidTokenError,
	UnauthorizedError,
} from "express-oauth2-jwt-bearer";
import { AppError, DatabaseError } from "../../types/Errors";
import { Response, Request, NextFunction } from "express";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	// eslint-disable-next-line
	_next: NextFunction
) => {
	console.log("Error:", err);

	if (
		err instanceof UnauthorizedError ||
		err instanceof InvalidRequestError ||
		err instanceof InvalidTokenError ||
		err instanceof InsufficientScopeError
	) {
		return res
			.status(err.status || 500)
			.json({ message: err.message || "Invalid or missing token" });
	}

	if (err instanceof AppError) {
		const response = {
			message: err.message || "Internal Server Error",
			code: err.code,
		};

		const status = err.status || 500;

		if (process.env.NODE_ENV === "development") {
			if (err instanceof DatabaseError) {
				return res.status(status).json({
					...response,
					stack: err.stack,
					databaseCode: err.databaseCode || "",
					databaseMessage: err.databaseMessage || "",
					databaseDetails: err.databaseDetails || "",
				});
			} else {
				return res.status(status).json({
					...response,
					stack: err.stack,
				});
			}
		} else {
			return res.status(status).json(response);
		}
	} else if (err instanceof Error) {
		if (process.env.NODE_ENV === "development") {
			return res.status(500).json({
				message: err.message,
				stack: err.stack,
			});
		} else {
			return res.status(500).json({ message: err.message });
		}
	}
};
