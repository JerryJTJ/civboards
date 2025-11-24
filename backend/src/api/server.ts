import { Database } from "../interfaces/supabase.js";
import { contentSecurityPolicy } from "helmet";
import { createClient } from "@supabase/supabase-js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { getExpansionById } from "./repositories/expansion.repository.js";
import Auth0Router from "./auth0/auth0.routes.js";
import CivilizationRouter from "./routes/civilization.routes.js";
import ExpansionRouter from "./routes/expansion.routes.js";
import GameRouter from "./routes/game.routes.js";
import GamemodeRouter from "./routes/gamemode.routes.js";
import LeaderRouter from "./routes/leader.routes.js";
import ParseRouter from "./parse/parse.api.js";
import PlayerRouter from "./routes/player.routes.js";
import UserRouter from "./routes/user.routes.js";
import VictoryRouter from "./routes/victory.routes.js";
import axios from "axios";
import checkJwt from "./middlewares/auth/checkJwt.js";
import compression from "compression";
import cors from "cors";
import express, { json } from "express";

//Supabase connection
const PORT = process.env.PORT ?? 5050;

const SUPABASE_URL = process.env.SUPABASE_URL;
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
	contentSecurityPolicy({
		directives: {
			"script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
		},
	})
);
app.use(json());

// Routes
app.use("/civilization", CivilizationRouter);
app.use("/leader", LeaderRouter);
app.use("/expansion", ExpansionRouter);
app.use("/victory", VictoryRouter);
app.use("/gamemode", GamemodeRouter);
app.use("/game", GameRouter);
app.use("/player", PlayerRouter);
app.use("/user", UserRouter);
app.use("/parse", checkJwt(), ParseRouter);
app.use("/auth0", Auth0Router);

// This is just to keep the database and backend running
app.get("/ping", async (_req: express.Request, res: express.Response) => {
	await getExpansionById(1);
	res.status(200).end();
});

// Call ping endpoint every 5 minutes
setInterval(() => {
	void axios.get(`http://localhost:${PORT.toString()}/ping`);
}, 300000);

//Error handlers (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(
		new Date().toLocaleTimeString() +
			`: Server is running on port ${PORT.toString()}...`
	);
});
