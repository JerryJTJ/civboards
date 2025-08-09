import { TablesInsert } from "../../interfaces/supabase";
import { throwNotFoundError, throwValidationError } from "../../types/Errors";

import {
	doesGameIdExist,
	getGameById,
	insertGame,
} from "../repositories/game.repository";
import { fetchLeaderById } from "./leader.service";

export async function createGame(
	name: string,
	map: string,
	mapSize: string,
	speed: string,
	turns: number,
	winnerPlayer: string,
	winnerLeaderId: number,
	isFinished: boolean,
	victoryId: number
) {
	const winnerCivilizationId = (await fetchLeaderById(winnerLeaderId))
		?.civilization;
	const game = {
		name: name,
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
