import { TablesInsert } from "../../interfaces/supabase";
import { throwNotFoundError, throwValidationError } from "../../types/Errors";

import {
	deleteGameById,
	doesGameIdExist,
	getAllGameVictoryIds,
	getAllGameWinnerCivilizationIds,
	getAllGameWinnerLeaderIds,
	getAllGameWinners,
	getAllGames,
	getGameById,
	insertGame,
	softDeleteGameById,
} from "../repositories/game.repository";
import { fetchCivilizationById } from "./civilization.service";
import { removeGameExpansionByGameId } from "./gameExpansion.service";
import { removeGameGamemodesByGameId } from "./gameGamemode.service";
import { removeGamePlayerByGameId } from "./gamePlayer.service";
import { fetchLeaderById } from "./leader.service";
import { fetchVictoryById } from "./victory.service";

export async function createGame(
	finished: boolean,
	date: string | undefined,
	name: string,
	map: string,
	mapSize: string,
	speed: string,
	turns: number,
	winnerPlayer?: string,
	winnerLeaderId?: number,
	victoryId?: number
) {
	let winnerCivilizationId;
	if (finished && winnerLeaderId)
		winnerCivilizationId = (await fetchLeaderById(winnerLeaderId))
			?.civilization_id;

	const game = {
		finished: finished,
		date: date,
		name: name,
		map: map,
		map_size: mapSize,
		speed: speed,
		turns: turns,
		winner_player: winnerPlayer,
		winner_leader_id: winnerLeaderId,
		winner_civilization_id: winnerCivilizationId || undefined,
		victory_id: victoryId || undefined,
	} as TablesInsert<"game">;

	const insertedGame = await insertGame(game);

	return insertedGame;
}

export async function fetchGameById(id: string) {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	const game = await getGameById(id);
	return game;
}

export async function removeGameById(id: string): Promise<void> {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	await Promise.all([
		deleteGameById(id),
		removeGamePlayerByGameId(id),
		removeGameExpansionByGameId(id),
		removeGameGamemodesByGameId(id),
	]);
}

export async function softRemoveGameById(id: string): Promise<void> {
	if (!id) throwValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id))) throwNotFoundError("Invalid Game Id");

	await softDeleteGameById(id);
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

export async function fetchAllGameWinnerLeaderIds() {
	const gameWinners = await getAllGameWinnerLeaderIds();

	const leaders = new Map<number, number>();

	// Find the count
	gameWinners?.forEach((leader) => {
		if (typeof leader.winner_leader_id === "number") {
			leaders.set(
				leader.winner_leader_id,
				leaders.has(leader.winner_leader_id)
					? leaders.get(leader.winner_leader_id)! + 1
					: 1
			);
		}
	});

	// Add names
	const leadersArr: Array<{
		leaderId: number;
		leaderName: string;
		wins: number;
	}> = await Promise.all(
		Array.from(leaders).map(async ([leaderId, wins]) => {
			const name = (await fetchLeaderById(leaderId))?.name || "";

			return {
				leaderId: leaderId,
				leaderName: name,
				wins: wins,
			};
		})
	);

	return leadersArr;
}

export async function fetchAllGameWinnerCivilizationIds() {
	const gameWinners = await getAllGameWinnerCivilizationIds();

	const civs = new Map<number, number>();

	// Find count
	gameWinners?.forEach((civ) => {
		if (typeof civ.winner_civilization_id === "number") {
			civs.set(
				civ.winner_civilization_id,
				civs.has(civ.winner_civilization_id)
					? civs.get(civ.winner_civilization_id)! + 1
					: 1
			);
		}
	});

	// Add names
	const civsArr: Array<{
		civilizationId: number;
		civilizationName: string;
		wins: number;
	}> = await Promise.all(
		Array.from(civs).map(async ([civilizationId, wins]) => {
			const name =
				(await fetchCivilizationById(civilizationId))?.name || "";

			return {
				civilizationId: civilizationId,
				civilizationName: name,
				wins: wins,
			};
		})
	);

	return civsArr;
}

export async function fetchAllGameVictoryIds() {
	const wins = await getAllGameVictoryIds();

	const victories = new Map<number, number>();

	// Get count
	wins?.forEach((victory) => {
		if (typeof victory.victory_id === "number") {
			victories.set(
				victory.victory_id,
				victories.has(victory.victory_id)
					? victories.get(victory.victory_id)! + 1
					: 1
			);
		}
	});

	// Add names
	const victoriesArr: Array<{
		victoryId: number;
		victoryType: string;
		wins: number;
	}> = await Promise.all(
		Array.from(victories).map(async ([victoryId, wins]) => {
			const name = (await fetchVictoryById(victoryId))?.type || "";

			return {
				victoryId: victoryId,
				victoryType: name,
				wins: wins,
			};
		})
	);

	return victoriesArr;
}
