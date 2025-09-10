import * as z from "zod";
import { PlayerSchema } from "@civboards/schemas";
import { TablesInsert } from "../../interfaces/supabase";

import {
	doesGameIdExist,
	getGameWinsByPlayer,
} from "../repositories/game.repository";
import {
	deleteGamePlayersByGameId,
	getAllGamesPlayedByPlayer,
	getGamePlayersByGameId,
	getProfileInfoByName,
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

export async function fetchProfileInfoByName(name: string) {
	const data = await getProfileInfoByName(name);
	const leaders = new Map<string, { played: number; wins: number }>();
	const civs = new Map<string, { played: number; wins: number }>();

	data.forEach((play) => {
		const { leader, civilization } = play;

		if (leader) {
			leaders.set(leader, {
				played: leaders.has(leader)
					? leaders.get(leader)!.played + 1
					: 1,
				wins: 0,
			});
		}
		if (civilization) {
			civs.set(civilization, {
				played: civs.has(civilization)
					? civs.get(civilization)!.played + 1
					: 1,
				wins: 0,
			});
		}
	});

	const wins = await getGameWinsByPlayer(name);
	wins.forEach((win) => {
		if (win.leader) {
			leaders.set(win.leader, {
				played: leaders.get(win.leader)?.played as number,
				wins:
					leaders.get(win.leader)?.wins === 0
						? 1
						: (leaders.get(win.leader)?.wins as number) + 1,
			});
		}
		if (win.civilization) {
			civs.set(win.civilization, {
				played: civs.get(win.civilization)?.played as number,
				wins:
					civs.get(win.civilization)?.wins === 0
						? 1
						: (civs.get(win.civilization)?.wins as number) + 1,
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
