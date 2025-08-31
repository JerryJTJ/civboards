import {
	createGame,
	fetchAllGameVictoryIds,
	fetchAllGameWinnerCivilizationIds,
	fetchAllGameWinnerLeaderIds,
	fetchAllGameWinners,
	fetchAllGames,
	fetchGameById,
	removeGameById,
	softRemoveGameById,
	updateGame,
} from "../services/game.service";
import { NextFunction, Request, Response } from "express";
import {
	createGameGamemodes,
	fetchGameGamemodesIdsByGameId,
} from "../services/gameGamemode.service";
import {
	createGameExpansions,
	fetchGameExpansionsIdsByGameId,
} from "../services/gameExpansion.service";
import {
	createGamePlayers,
	fetchGamePlayersByGameId,
} from "../services/gamePlayer.service";
import { throwValidationError } from "../../types/Errors";
import {
	InsertGameSchema,
	DisplayGameSchemaArray,
	UpdateGameSchema,
} from "@civboards/schemas";
import * as z from "zod";

export async function handleCreateGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.body) throwValidationError("No request body recieved");

	const result = InsertGameSchema.safeParse(req.body);
	if (!result.success) {
		throwValidationError("Fields were either incorrect or missing");
		return; //This is just so TS complier doesn't think data may be undefined
	}

	try {
		await createGame(result.data);
		return res.status(200).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetGameById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const [game, players, expansions, gamemodes] = await Promise.all([
			fetchGameById(id),
			fetchGamePlayersByGameId(id),
			fetchGameExpansionsIdsByGameId(id),
			fetchGameGamemodesIdsByGameId(id),
		]);

		if (game) {
			return res.status(200).json({
				id: game.id,
				date: game.date,
				finished: game.finished,
				map: game.map,
				mapSize: game.map_size,
				name: game.name,
				speed: game.speed,
				turns: game.turns,
				victoryId: game.victory_id || undefined,
				winnerCivilizationId: game.winner_civilization_id || undefined,
				winnerLeaderId: game.winner_leader_id,
				winnerPlayer: game.winner_player,
				players: players,
				gamemodes: gamemodes,
				expansions: expansions,
			});
		}
		return res.status(404).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGames(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const games = await fetchAllGames();

	if (games) {
		const fullGames = await Promise.all(
			games.map(async (game) => {
				const gameId = game.id;

				try {
					const [players, gamemodes, expansions] = await Promise.all([
						fetchGamePlayersByGameId(gameId),
						fetchGameGamemodesIdsByGameId(gameId),
						fetchGameExpansionsIdsByGameId(gameId),
					]);

					return {
						id: game.id,
						date: game.date,
						finished: game.finished,
						map: game.map,
						mapSize: game.map_size,
						name: game.name,
						speed: game.speed,
						turns: game.turns,
						victoryId: game.victory_id || undefined,
						winnerCivilizationId:
							game.winner_civilization_id || undefined,
						winnerLeaderId: game.winner_leader_id,
						winnerPlayer: game.winner_player,
						players: players,
						gamemodes: gamemodes,
						expansions: expansions,
					};
				} catch (error) {
					next(error);
				}
			})
		);

		const validate = DisplayGameSchemaArray.safeParse(fullGames);
		if (validate.success) return res.status(200).json(validate.data);
		return res.status(400).json(z.treeifyError(validate.error));
	}

	return res.status(400).end();
}

export async function handleGetAllGameWinners(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const winners = await fetchAllGameWinners();
		const winnerJson = new Array<{ player: string; wins: number }>();

		for (const [player, wins] of winners) {
			winnerJson.push({ player: player, wins: wins });
		}

		return res.status(200).json(winnerJson);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameWinnerLeaderIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const leaders = await fetchAllGameWinnerLeaderIds();

		return res.status(200).json(leaders);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameWinnerCivilizationIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const civs = await fetchAllGameWinnerCivilizationIds();

		return res.status(200).json(civs);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameVictoryIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const victories = await fetchAllGameVictoryIds();
		return res.status(200).json(victories);
	} catch (error) {
		next(error);
	}
}

export async function handleSoftDeleteGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		await softRemoveGameById(id);
		return res.status(202).end();
	} catch (error) {
		next(error);
	}
}

export async function handleUpdateGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.params) throwValidationError("No request id recieved");
	if (!req.body) throwValidationError("No request body recieved");

	const { id } = req.params;

	const result = UpdateGameSchema.safeParse(req.body);
	if (!result.success) {
		throwValidationError("Fields were either incorrect or missing");
		return; //This is just so TS complier doesn't think data may be undefined
	}

	try {
		const update = await updateGame(id, result.data);
		return res.status(200).json(update);
	} catch (error) {
		next(error);
	}
}
