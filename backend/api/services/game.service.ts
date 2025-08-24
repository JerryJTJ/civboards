import { TablesInsert } from "../../interfaces/supabase";
import { throwNotFoundError, throwValidationError } from "../../types/Errors";

import {
	deleteGameById,
	doesGameIdExist,
	getAllGameWinners,
	getAllGames,
	getGameById,
	insertGame,
} from "../repositories/game.repository";
import { removeGameExpansionByGameId } from "./gameExpansion.service";
import { removeGameGamemodesByGameId } from "./gameGamemode.service";
import { removeGamePlayerByGameId } from "./gamePlayer.service";
import { fetchLeaderById } from "./leader.service";

export async function createGame(
	name: string,
	map: string,
	mapSize: string,
	speed: string,
	turns: number,
	winnerPlayer: string,
	winnerLeaderId: number,
	victoryId: number
) {
	const winnerCivilizationId = (await fetchLeaderById(winnerLeaderId))
		?.civilization_id;
	const game = {
		name: name,
		map: map,
		map_size: mapSize,
		speed: speed,
		turns: turns,
		winner_player: winnerPlayer,
		winner_leader_id: winnerLeaderId,
		winner_civilization_id: winnerCivilizationId,
		victory_id: victoryId,
	} as TablesInsert<"game">;
	const insertedGame = await insertGame(game);
	return insertedGame;
}

export async function fetchGameById(id: number) {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	const game = await getGameById(id);
	return game;
}

export async function removeGameById(id: number) {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	await Promise.all([
		deleteGameById(id),
		removeGamePlayerByGameId(id),
		removeGameExpansionByGameId(id),
		removeGameGamemodesByGameId(id),
	]);
}

export async function fetchAllGames() {
	return await getAllGames();
}

export async function fetchAllGameWinners() {
	const gameWinners = await getAllGameWinners();

	const winners = new Map<string, number>();

	gameWinners?.forEach((winner) => {
		if (typeof winner.winner_player === "string") {
			winners.set(
				winner.winner_player,
				winners.has(winner.winner_player)
					? winners.get(winner.winner_player)! + 1
					: 1
			);
		}
	});

	return winners;
}
