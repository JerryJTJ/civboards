import { createGame, fetchGameById } from "../services/game.service";
import { Request, Response } from "express";
import { TablesInsert } from "../../interfaces/supabase";
import { InsertGame } from "../../interfaces/game.interface";
import {
	createGameGamemodes,
	fetchGameGamemodesByGameId,
} from "../services/gameGamemode.service";
import { createGameExpansions } from "../services/gameExpansions.service";
import { createGamePlayers } from "../services/gamePlayer.service";

export async function handleCreateGame(
	req: Request<{}, {}, InsertGame>,
	res: Response,
	next
) {
	const { gameState, players, expansions, gamemodes } = req.body;

	try {
		const createdGame = await createGame(
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

export async function handleGetGameById(req: Request, res: Response, next) {
	const { id } = req.params;
	const gameId = Number(id);

	try {
		const game = await fetchGameById(gameId);
		const game_gamemodes = await fetchGameGamemodesByGameId(gameId);

		return res
			.status(200)
			.json({ gameState: game, gamemodes: game_gamemodes });
	} catch (error) {
		res.status(404).end();
		next(error);
	}
}
