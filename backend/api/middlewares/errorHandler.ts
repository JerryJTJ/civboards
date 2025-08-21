import { AppError } from "../../types/Errors";
import { Response, Request, NextFunction } from "express";

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("Error:", err);

	const status = err.status || 500;

	if (process.env.NODE_ENV === "development") {
		res.status(status).json({
			message: err.message,
			stack: err.stack,
			code: err.code,
			databaseCode: err.databaseCode || "",
			databaseMessage: err.databaseMessage || "",
			databaseDetails: err.databaseDetails || "",
		});
	} else {
		res.status(status).json({
			message: err.message || "Internal Server Error",
			code: err.code,
		});
	}
};
