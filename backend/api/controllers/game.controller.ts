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
import { InsertGameSchema, DisplayGameSchemaArray } from "@civboards/schemas";
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
	const {
		finished,
		date,
		name,
		map,
		mapSize,
		speed,
		turns,
		winnerPlayer,
		winnerLeaderId,
		victoryId,
		players,
		expansions,
		gamemodes,
	} = result.data;

	try {
		const createdGame = await createGame(
			finished,
			date,
			name,
			map,
			mapSize,
			speed,
			turns,
			winnerPlayer,
			winnerLeaderId,
			victoryId
		);

		if (createdGame !== null && createdGame !== undefined) {
			const gameId = createdGame[0].id;

			try {
				await Promise.all([
					createGamePlayers(gameId, players),
					createGameExpansions(gameId, expansions!),
					createGameGamemodes(gameId, gamemodes!),
				]);
			} catch (error) {
				await removeGameById(gameId);
				next(error);
			}

			return res.status(200).end();
		} else {
			throw new Error("Failed to create game");
		}
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
