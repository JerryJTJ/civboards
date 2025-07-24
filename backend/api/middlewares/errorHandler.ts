import { AppError } from "../../types/Errors";

export const errorHandler = (err: AppError, req, res, next) => {
	console.error("Error:", err);

	if (process.env.NODE_ENV === "development") {
		res.json({
			status: "error",
			message: err.message,
			stack: err.stack,
			details: err.details || "",
		});
	} else {
		res.json({
			status: "error",
			message: err.message || "Internal Server Error",
			details: err.details || "",
		});
	}
};
