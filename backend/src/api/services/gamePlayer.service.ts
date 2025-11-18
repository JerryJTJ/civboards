import * as z from "zod";
import { PlayerSchema } from "@civboards/schemas";
import { TablesInsert } from "../../interfaces/supabase.js";

import { ValidationError } from "../../types/Errors.js";
import {
	deleteGamePlayersByGameId,
	getAllGamePlayers,
	getAllGamesPlayedByPlayer,
	getGamePlayersByGameId,
	getProfileInfoByName,
	insertGamePlayers,
} from "../repositories/gamePlayer.repository.js";
import {
	doesGameIdExist,
	getGameWinsByPlayer,
} from "../repositories/game.repository.js";
import { fetchCivilizationIdByLeaderId } from "./leader.service.js";

export async function fetchAllUniqueGamePlayers() {
	const data = await getAllGamePlayers();
	return new Set<string>(data.map((player) => player.name));
}

export async function createGamePlayers(
	gameId: string,
	players: z.infer<typeof PlayerSchema>[]
) {
	if (players.length === 0) throw new ValidationError("No players to add");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	players.forEach((player) => {
		if (!player.leaderId || !player.leaderId)
			throw new ValidationError("Invalid Player Data");
	});

	// We want to keep JSON in camelCase and only use snake_case for DB operations
	const gamePlayers = (await Promise.all(
		players.map(async (player) => {
			const civId = (await fetchCivilizationIdByLeaderId(player.leaderId))
				.civilization_id;
			return {
				game_id: gameId,
				name: player.name.toLocaleLowerCase(),
				leader_id: player.leaderId,
				civilization_id: civId,
				is_human: player.isHuman,
			};
		})
	)) as TablesInsert<"game_player">[];
	await insertGamePlayers(gamePlayers);
}

export async function fetchGamePlayersByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gamePlayers = await getGamePlayersByGameId(gameId);
	const gamePlayersSanitized = gamePlayers.map((gamePlayer) => {
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

export async function fetchProfileInfoByName(name: string) {
	const data = await getProfileInfoByName(name);
	const leaders = new Map<string, { played: number; wins: number }>();
	const civs = new Map<string, { played: number; wins: number }>();

	data.forEach((play) => {
		const { leader, civilization } = play;

		if (leader) {
			const current = leaders.get(leader) ?? { played: 0 };
			leaders.set(leader, {
				played: current.played + 1,
				wins: 0,
			});
		}
		if (civilization) {
			const current = civs.get(civilization) ?? { played: 0 };
			civs.set(civilization, {
				played: current.played + 1,
				wins: 0,
			});
		}
	});

	const wins = await getGameWinsByPlayer(name);
	// Played should already be recorded above, but just in case initialize played to 1
	wins.forEach((win) => {
		const current = leaders.get(win.leader) ?? { played: 1, wins: 0 };
		if (win.leader) {
			leaders.set(win.leader, {
				played: current.played,
				wins: current.wins + 1,
			});
		}
		if (win.civilization) {
			const current = civs.get(win.civilization) ?? {
				played: 1,
				wins: 0,
			};
			civs.set(win.civilization, {
				played: current.played,
				wins: current.wins + 1,
			});
		}
	});

	const leadersArr = Array.from(leaders).map(([name, data]) => {
		return { name: name, played: data.played, wins: data.wins };
	});
	const civsArr = Array.from(civs).map(([name, data]) => {
		return { name: name, played: data.played, wins: data.wins };
	});

	return { civilizations: civsArr, leaders: leadersArr };
}

export async function fetchNumGamesPlayedByPlayer(player: string) {
	const data = await getAllGamesPlayedByPlayer(player);
	return data.length;
}

export async function fetchNumGamesFinishedByPlayer(player: string) {
	const data = await getProfileInfoByName(player);
	return data.length;
}

export async function fetchNumGamesWonByPlayer(player: string) {
	const data = await getGameWinsByPlayer(player);
	return data.length;
}
