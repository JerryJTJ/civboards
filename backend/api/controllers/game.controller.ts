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
	removeGameGamemodesByGameId,
} from "../services/gameGamemode.service";
import {
	createGameExpansions,
	fetchGameExpansionsIdsByGameId,
	removeGameExpansionByGameId,
} from "../services/gameExpansion.service";
import {
	createGamePlayers,
	fetchGamePlayersByGameId,
	removeGamePlayerByGameId,
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
	const gameId = Number(id);

	try {
		const [game, players, expansions, gamemodes] = await Promise.all([
			fetchGameById(gameId),
			fetchGamePlayersByGameId(gameId),
			fetchGameExpansionsIdsByGameId(gameId),
			fetchGameGamemodesIdsByGameId(gameId),
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
		const leadersJson = new Array<{ leaderId: number; wins: number }>();

		for (const [leaderId, wins] of leaders) {
			leadersJson.push({ leaderId: leaderId, wins: wins });
		}

		return res.status(200).json(leadersJson);
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
		const civsJson = new Array<{ civilizationId: number; wins: number }>();

		for (const [civilizationId, wins] of civs) {
			civsJson.push({ civilizationId: civilizationId, wins: wins });
		}

		return res.status(200).json(civsJson);
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
		const victoriesJson = new Array<{ victoryId: number; wins: number }>();

		for (const [victoryId, wins] of victories) {
			victoriesJson.push({ victoryId: victoryId, wins: wins });
		}

		return res.status(200).json(victoriesJson);
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
		await softRemoveGameById(Number(id));
		return res.status(202).end();
	} catch (error) {
		next(error);
	}
}
