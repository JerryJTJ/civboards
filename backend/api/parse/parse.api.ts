import z from "zod";
import express from "express";
import multer from "multer";
import { ParseSaveSchema } from "@civboards/schemas";
import { parse } from "../../submodules/civ6-save-parser/parse";
import { throwParseError, throwValidationError } from "../../types/Errors";
import { fetchLeaderFromCode } from "../services/leader.service";
import { fetchExpansionByCode } from "../services/expansion.service";

const ParseRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface ParseApiResponse {
	speed: string;
	turns: number;
	map: string;
	mapSize: string;
	players: Array<{
		leader: string;
		isHuman: boolean;
		name?: string;
	}>;
	expansions: Array<string>;
}

ParseRouter.post(
	"/upload",
	upload.single("savefile"),
	async (req: express.Request, res: express.Response) => {
		if (!req.file) {
			return throwValidationError("No file provided");
		}
		try {
			const parsed = parse(req.file?.buffer, {
				api: true,
			});
			const sanitized = await sanitizeSaveFile(parsed);
			res.status(200).json(sanitized);
		} catch (error: any) {
			return throwParseError(error?.message);
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
			const leaderId = (await fetchLeaderFromCode(player.leader))?.id;
			return {
				leaderId: leaderId,
				isHuman: player.isHuman,
				name: player.name || "",
			};
		})
	);

	const expansions = await Promise.all(
		parsed.expansions.map(
			async (expansion) => (await fetchExpansionByCode(expansion))?.id
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
