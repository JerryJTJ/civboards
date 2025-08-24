import {
	createGame,
	fetchAllGameWinners,
	fetchAllGames,
	fetchGameById,
	removeGameById,
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
import {
	InsertGameSchema,
	DisplayGameSchema,
	DisplayGameSchemaArray,
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
	const {
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
				createdAt: game.created_at,
				isFinished: game.is_finished,
				map: game.map,
				mapSize: game.map_size,
				name: game.name,
				speed: game.speed,
				turns: game.turns,
				victoryId: game.victory_id,
				winnerCivilizationId: game.winner_civilization_id,
				winnerLeaderId: game.winner_leader_id,
				winnerPlayer: game.winner_player,
				players: players,
				gamemodes: gamemodes,
				expansions: expansions,
			});
		}
		return res.status(404);
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
						createdAt: game.created_at,
						isFinished: game.is_finished,
						map: game.map,
						mapSize: game.map_size,
						name: game.name,
						speed: game.speed,
						turns: game.turns,
						victoryId: game.victory_id,
						winnerCivilizationId: game.winner_civilization_id,
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

	return res.status(400);
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
