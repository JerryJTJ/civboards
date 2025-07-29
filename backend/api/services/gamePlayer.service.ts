import { Player } from "../../interfaces/game.interface";
import { TablesInsert } from "../../interfaces/supabase";
import { throwValidationError, AppError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	getGamePlayersByGameId,
	insertGamePlayers,
} from "../repositories/gamePlayer.repository";

export async function createGamePlayers(
	gameId: number,
	players: Array<Player>
) {
	if (players.length === 0) throwValidationError("No players to add");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	players.forEach((player) => {
		if (!player.leaderId || !player.civilizationId || !player.name)
			throwValidationError("Invalid Player Data");
	});

	// We want to keep JSON in camelCase and only use snake_case for DB operations
	const gamePlayers = players.map((player) => {
		return {
			game_id: gameId,
			name: player.name,
			leader_id: player.leaderId,
			civilization_id: player.civilizationId,
			is_human: player.isHuman,
		};
	}) as Array<TablesInsert<"game_player">>;
	insertGamePlayers(gamePlayers);
}

export async function fetchGamePlayersByGameId(gameId: number) {
	if (!gameId) throwValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	try {
		const gamePlayers = await getGamePlayersByGameId(gameId);
		const gamePlayersSanitized = gamePlayers?.map((gamePlayer) => {
			return {
				id: gamePlayer.id,
				leaderId: gamePlayer.leader_id,
				civilizationId: gamePlayer.civilization_id,
				name: gamePlayer.name,
				isHuman: gamePlayer.is_human,
			};
		});
		return gamePlayersSanitized;
	} catch (error) {
		throw new AppError(error?.message, error.status, error?.details);
	}
}
