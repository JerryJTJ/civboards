import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../interfaces/supabase";
import CivilizationRouter from "./routes/civilization";

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
app.use(express.json());
app.use(compression());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
		},
	})
);

// app.get("/", async (req, res) => {
// 	const { data, error } = await supabase
// 		.from("civilization")
// 		.select("id")
// 		.eq("code", "CIVILIZATION_AMERICA")
// 		.maybeSingle();

// 	res.send(data);
// });

app.get("/games", async (req, res) => {
	try {
		const { data, error } = await supabase.from("game").select();
		res.send(data);
	} catch (error) {}
});

app.use("/civilization", CivilizationRouter);

app.listen(PORT, () =>
	console.log(
		new Date().toLocaleTimeString() +
			`: Server is running on port ${PORT}...`
	)
);
