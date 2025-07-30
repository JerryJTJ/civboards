import { createGame, fetchGameById } from "../services/game.service";
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
import { InsertGameSchema } from "../../interfaces/game.schema";

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
	const { gameState, players, expansions, gamemodes } = result.data;

	try {
		const createdGame = await createGame(
			gameState.name,
			gameState.map,
			gameState.mapSize,
			gameState.speed,
			gameState.turns,
			gameState.winnerPlayer,
			gameState.winnerLeaderId,
			gameState.winnerCivilizationId,
			gameState.isFinished,
			gameState.victoryId
		);

		if (createdGame !== null && createdGame !== undefined) {
			const gameId = createdGame[0].id;

			// TODO: If any of these fails, we want to rollback
			await createGamePlayers(gameId, players);
			await createGameExpansions(gameId, expansions);
			await createGameGamemodes(gameId, gamemodes);

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
		const gameInfo = await fetchGameById(gameId);
		const gamePlayers = await fetchGamePlayersByGameId(gameId);
		const gameExpansionsIds = await fetchGameExpansionsIdsByGameId(gameId);
		const gameGamemodesIds = await fetchGameGamemodesIdsByGameId(gameId);

		return res.status(200).json({
			gameState: gameInfo,
			gamePlayers: gamePlayers,
			gamemodes: gameGamemodesIds,
			expansions: gameExpansionsIds,
		});
	} catch (error) {
		next(error);
	}
}
