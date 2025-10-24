import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../interfaces/supabase";
import CivilizationRouter from "./routes/civilization.routes";
import LeaderRouter from "./routes/leader.routes";
import ExpansionRouter from "./routes/expansion.routes";
import VictoryRouter from "./routes/victory.routes";
import GamemodeRouter from "./routes/gamemode.routes";
import GameRouter from "./routes/game.routes";
import PlayerRouter from "./routes/player.routes";
import ParseRouter from "./parse/parse.api";
import UserRouter from "./routes/user.routes";
import checkJwt from "./middlewares/auth/checkJwt";

//Supabase connection
const PORT = process.env.PORT || 5050;

const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
	throw new Error("Missing supabase env variables");
}

export const supabase = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_SECRET_KEY
);

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
app.use("/player", PlayerRouter);
app.use("/user", UserRouter);
app.use("/parse", checkJwt, ParseRouter);
app.get("/ping", (_req: express.Request, res: express.Response) => {
	res.status(200).send("Ping!");
});

//Error handlers (must be last)
app.use(errorHandler);

app.listen(PORT, () =>
	console.log(
		new Date().toLocaleTimeString() +
			`: Server is running on port ${PORT}...`
	)
);
