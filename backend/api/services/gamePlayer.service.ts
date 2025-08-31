import * as z from "zod";
import { PlayerSchema } from "@civboards/schemas";
import { TablesInsert } from "../../interfaces/supabase";

import { doesGameIdExist } from "../repositories/game.repository";
import {
	deleteGamePlayersByGameId,
	getGamePlayersByGameId,
	insertGamePlayers,
} from "../repositories/gamePlayer.repository";
import { fetchCivilizationIdByLeaderId } from "./leader.service";
import { ValidationError } from "../../types/Errors";

export async function createGamePlayers(
	gameId: string,
	players: Array<z.infer<typeof PlayerSchema>>
) {
	if (players.length === 0) throw new ValidationError("No players to add");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

	players.forEach((player) => {
		if (!player.leaderId || !player.leaderId)
			throw new ValidationError("Invalid Player Data");
	});

	// We want to keep JSON in camelCase and only use snake_case for DB operations
	const gamePlayers = (await Promise.all(
		players.map(async (player) => {
			const civId = (await fetchCivilizationIdByLeaderId(player.leaderId))
				?.civilization_id;
			return {
				game_id: gameId,
				name: player.name,
				leader_id: player.leaderId,
				civilization_id: civId,
				is_human: player.isHuman,
			};
		})
	)) as Array<TablesInsert<"game_player">>;
	await insertGamePlayers(gamePlayers);
}

export async function fetchGamePlayersByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

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
}

export async function removeGamePlayerByGameId(gameId: string) {
	await deleteGamePlayersByGameId(gameId);
}
