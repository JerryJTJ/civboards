import * as z from "zod";
import { ParseError, ValidationError } from "../../types/Errors.js";
import { ParseSaveSchema } from "@civboards/schemas";
import { Request, Response, Router } from "express";
import { fetchExpansionByCode } from "../services/expansion.service.js";
import { fetchLeaderFromCode } from "../services/leader.service.js";
import { parse } from "../../submodules/civ6-save-parser/parse.js";
import multer, { memoryStorage } from "multer";

const ParseRouter = Router();

const storage = memoryStorage();
const upload = multer({ storage: storage });

interface ParseApiResponse {
	speed: string;
	turns: number;
	map: string;
	mapSize: string;
	players: {
		leader: string;
		isHuman: boolean;
		name?: string;
	}[];
	expansions: string[];
}

ParseRouter.post(
	"/upload",
	upload.single("savefile"),
	async (req: Request, res: Response) => {
		if (!req.file) {
			throw new ValidationError("No file provided");
		}
		try {
			// Weird linting but ok
			const parsed: ParseApiResponse = parse(req.file.buffer, {
				api: true,
			}) as ParseApiResponse;
			const sanitized = await sanitizeSaveFile(parsed);
			res.status(200).json(sanitized);
		} catch (error: unknown) {
			if (error instanceof Error) throw new ParseError(error.message);
			throw new ParseError();
		}
	}
);

async function sanitizeSaveFile(
	parsed: ParseApiResponse
): Promise<z.infer<typeof ParseSaveSchema>> {
	const gameState = {
		speed: parsed.speed.replace("GAMESPEED_", "").toLowerCase(),
		turns: parsed.turns,
		map: toTitleCase(
			parsed.map.replace(/^\{[^}]+\}Maps\/|(\.Civ6Map|\.lua)$/g, "")
		),
		mapSize: parsed.mapSize.replace("MAPSIZE_", "").toLowerCase(),
	};

	const players = await Promise.all(
		parsed.players.map(async (player) => {
			const leaderId = (await fetchLeaderFromCode(player.leader)).id;
			return {
				leaderId: leaderId,
				isHuman: player.isHuman,
				name: player.name ?? "",
			};
		})
	);

	const expansions = await Promise.all(
		parsed.expansions.map(
			async (expansion) => (await fetchExpansionByCode(expansion)).id
		)
	);

	const validate = ParseSaveSchema.safeParse({
		...gameState,
		players: players,
		expansions: expansions,
	});

	if (!validate.success) {
		throw new Error("Failed to validate");
	}

	return validate.data;
}

function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
}

export default ParseRouter;
