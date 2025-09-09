import { ProfileSchema } from "@civboards/schemas";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../types/Errors";
import {
	fetchProfileInfoByName,
	fetchAllGamesPlayedByPlayer,
} from "../services/gamePlayer.service";

export async function handleGetProfileInfoByName(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.params) throw new ValidationError("No request id recieved");

	const { name } = req.params;

	try {
		const wins = await fetchProfileInfoByName(name);
		const played = await fetchAllGamesPlayedByPlayer(name);

		if (played === 0) {
			throw new ValidationError("Player hasn't played a game yet");
		}

		const validate = ProfileSchema.safeParse({
			username: name,
			played: played,
			finished: wins.civilizations.length,
			civs: wins.civilizations,
			leaders: wins.leaders,
		});

		if (!validate.success) {
			throw new ValidationError("Failed to get proper profile data");
		}

		return res.status(200).json(validate.data);
	} catch (error) {
		next(error);
	}
}
