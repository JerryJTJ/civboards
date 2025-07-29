import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../interfaces/supabase";
import CivilizationRouter from "./routes/civilization.routes";
import LeaderRouter from "./routes/leader.routes";
import ExpansionRouter from "./routes/expansion.routes";
import { errorHandler } from "./middlewares/errorHandler";
import VictoryRouter from "./routes/victory.routes";
import GamemodeRouter from "./routes/gamemode.routes";
import GameRouter from "./routes/game.routes";
import { Request, Response } from "express";
import multer from "multer";
import { parse } from "../submodules/civ6-save-parser/parse";
import { readFileSync } from "node:fs";
import { ParseRouter } from "./parse/parseAPI";
import { throwParseError, throwValidationError } from "../types/Errors";

//Supabase connection
const PORT = process.env.PORT || 5050;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error("Missing supabase env variables");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

//Express stuff
const app = express();

//Middleware
app.use(cors());
app.use(compression());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
		},
	})
);
app.use(express.json());

// Routes
app.use("/civilization", CivilizationRouter);
app.use("/leader", LeaderRouter);
app.use("/expansion", ExpansionRouter);
app.use("/victory", VictoryRouter);
app.use("/gamemode", GamemodeRouter);
app.use("/game", GameRouter);
app.use("/parse", ParseRouter);
app.get("/ping", (req: Request, res: Response) => {
	res.status(200).send("Ping!");
});

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// app.post(
// 	"/parse",
// 	upload.single("savefile"),
// 	(req: express.Request, res: express.Response, next) => {
// 		if (!req.file) {
// 			return throwValidationError("No file provided");
// 		}
// 		try {
// 			const parsed = parse(req.file?.buffer, {
// 				clean: true,
// 			});
// 			res.status(200).json(parsed);
// 		} catch (error) {
// 			// console.log(error);
// 			return throwParseError();
// 		}
// 	}
// );

//Error handlers (must be last)
app.use(errorHandler);

app.listen(PORT, () =>
	console.log(
		new Date().toLocaleTimeString() +
			`: Server is running on port ${PORT}...`
	)
);
