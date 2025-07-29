import { Player } from "../../interfaces/game.interface";
import { Database, TablesInsert } from "../../interfaces/supabase";
import {
	AppError,
	throwDatabaseError,
	throwNotFoundError,
	throwValidationError,
} from "../../types/Errors";
import { insertExpansions } from "../repositories/gameExpansion.repository";
import { insertGamemodes } from "../repositories/gameGamemode.repository";
import { insertGamePlayers } from "../repositories/gamePlayer.repository";
import {
	doesGameIdExist,
	getGameById,
	insertGame,
} from "../repositories/game.repository";

export async function createGame(
	map: string,
	mapSize: string,
	speed: string,
	turns: number,
	winnerPlayer: string,
	winnerLeaderId: number,
	winnerCivilizationId: number,
	isFinished: boolean,
	victoryId: number
) {
	const game = {
		map: map,
		map_size: mapSize,
		speed: speed,
		turns: turns,
		winner_player: winnerPlayer,
		winner_leader_id: winnerLeaderId,
		winner_civilization_id: winnerCivilizationId,
		is_finished: isFinished,
		victory_id: victoryId,
	} as TablesInsert<"game">;
	const insertedGame = await insertGame(game);
	return insertedGame;
}

export async function fetchGameById(id: number) {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	const game = getGameById(id);
	return game;
}
