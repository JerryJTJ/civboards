import { ProfileSchema } from "@civboards/schemas";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../types/Errors";
import {
	fetchProfileInfoByName,
	fetchNumGamesWonByPlayer,
	fetchNumGamesFinishedByPlayer,
	fetchNumGamesPlayedByPlayer,
	fetchAllUniqueGamePlayers,
} from "../services/gamePlayer.service";

export async function handleGetAllUniquePlayers(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const players = await fetchAllUniqueGamePlayers();
		return res.status(200).json([...players]);
	} catch (error) {
		next(error);
	}
}

export async function handleGetProfileInfoByName(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.params) throw new ValidationError("No request id recieved");

	const { name } = req.params;

	try {
		const gamesPlayed = await fetchNumGamesPlayedByPlayer(name);

		if (gamesPlayed === 0) {
			throw new ValidationError("Player hasn't played a game yet");
		}

		const [wins, gamesWon, gamesFinished] = await Promise.all([
			fetchProfileInfoByName(name),
			fetchNumGamesWonByPlayer(name),
			fetchNumGamesFinishedByPlayer(name),
		]);

		const validate = ProfileSchema.safeParse({
			username: name,
			played: gamesPlayed,
			finished: gamesFinished,
			won: gamesWon,
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
