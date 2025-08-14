import { AppError } from "../../types/Errors";
import { Response, Request, NextFunction } from "express";

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("Error:", err);

	if (process.env.NODE_ENV === "development") {
		res.status(err.status).json({
			message: err.message,
			stack: err.stack,
			code: err.code,
			databaseCode: err.databaseCode || "",
			databaseMessage: err.databaseMessage || "",
			databaseDetails: err.databaseDetails || "",
		});
	} else {
		res.status(err.status).json({
			message: err.message || "Internal Server Error",
			code: err.code,
		});
	}
};
