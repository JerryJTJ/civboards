import express from "express";
import multer from "multer";
import { parse } from "../../submodules/civ6-save-parser/parse";
import { throwParseError, throwValidationError } from "../../types/Errors";

export const ParseRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

ParseRouter.post(
	"/upload",
	upload.single("savefile"),
	(req: express.Request, res: express.Response, next) => {
		if (!req.file) {
			return throwValidationError("No file provided");
		}
		try {
			const parsed = parse(req.file?.buffer, {
				clean: true,
			});
			res.status(200).json(parsed);
		} catch (error) {
			return throwParseError(error?.message);
		}
	}
);
