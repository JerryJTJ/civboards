import { UpdateGameSchema, InsertGameSchema } from "@civboards/schemas";
import { TablesInsert, TablesUpdate } from "../../interfaces/supabase";
import { AppError, NotFoundError, ValidationError } from "../../types/Errors";

import {
	deleteGameById,
	doesGameIdExist,
	getAllGameVictoryIds,
	getAllGameWinnerCivilizationIds,
	getAllGameWinnerLeaderIds,
	getAllGameWinners,
	getAllGames,
	getGameById,
	getGamesById,
	insertGame,
	softDeleteGameById,
	updateGameById,
} from "../repositories/game.repository";
import { fetchCivilizationById } from "./civilization.service";
import {
	createGameExpansions,
	removeGameExpansionByGameId,
} from "./gameExpansion.service";
import {
	createGameGamemodes,
	removeGameGamemodesByGameId,
} from "./gameGamemode.service";
import {
	createGamePlayers,
	removeGamePlayerByGameId,
} from "./gamePlayer.service";
import { fetchLeaderById } from "./leader.service";
import { fetchVictoryById } from "./victory.service";
import * as z from "zod";
import { getAllGamesPlayedByPlayer } from "../repositories/gamePlayer.repository";

export async function createGame(game: z.infer<typeof InsertGameSchema>) {
	// Validation

	if (game.finished) {
		if (!game.winnerPlayer || !game.winnerLeaderId)
			throw new ValidationError("Finished games need a winner");
		if (!game.victoryId)
			throw new ValidationError("Finished games need a victory");

		// Make sure winners match
		const winner = game.players.find(
			(player) => player.name === game.winnerPlayer
		);
		if (!winner) throw new ValidationError("Finished games need a winner");

		if (winner!.leaderId !== game.winnerLeaderId)
			throw new ValidationError("Finished games need a winner");
	}

	let winnerCivilizationId;
	if (game.finished && game.winnerLeaderId)
		winnerCivilizationId = (await fetchLeaderById(game.winnerLeaderId))
			?.civilization_id;

	const insert = {
		finished: game.finished,
		date: game.date,
		name: game.name,
		map: game.map,
		map_size: game.mapSize,
		speed: game.speed,
		turns: game.turns,
		winner_player: game.winnerPlayer,
		winner_leader_id: game.winnerLeaderId,
		winner_civilization_id: winnerCivilizationId || undefined,
		victory_id: game.victoryId || undefined,
	} as TablesInsert<"game">;

	let gameId;

	try {
		const insertedGame = await insertGame(insert);
		gameId = insertedGame.id;

		await Promise.all([
			createGamePlayers(gameId, game.players),
			game.expansions
				? createGameExpansions(gameId, game.expansions)
				: null,
			game.gamemodes ? createGameGamemodes(gameId, game.gamemodes) : null,
		]);
		return insertedGame;
	} catch {
		if (gameId) await removeGameById(gameId);
		throw new Error("Failed to create game");
	}
}

export async function fetchGameById(id: string) {
	if (!id) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id)))
		throw new NotFoundError("Invalid Game Id");

	const game = await getGameById(id);
	return game;
}

export async function removeGameById(id: string): Promise<void> {
	if (!id) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id)))
		throw new NotFoundError("Invalid Game Id");

	await deleteGameById(id);
}

export async function softRemoveGameById(id: string): Promise<void> {
	if (!id) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(id)))
		throw new NotFoundError("Invalid Game Id");

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

export async function updateGame(
	id: string,
	game: z.infer<typeof UpdateGameSchema>
) {
	const gameId = game.id;

	// Validation
	if (!gameId) throw new ValidationError("Invalid Game Id");
	if (id !== gameId) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(gameId)))
		throw new NotFoundError("Invalid Game Id");

	if (game.finished) {
		if (!game.winnerPlayer || !game.winnerLeaderId)
			throw new ValidationError("Finished games need a winner");
		if (!game.victoryId)
			throw new ValidationError("Finished games need a victory");

		// Make sure winners match
		const winner = game.players.find(
			(player) => player.name === game.winnerPlayer
		);
		if (!winner) throw new ValidationError("Finished games need a winner");

		if (winner!.leaderId !== game.winnerLeaderId)
			throw new ValidationError("Finished games need a winner");
	}

	// Update game
	let winnerCivilizationId;
	if (game.finished && game.winnerLeaderId)
		winnerCivilizationId = (await fetchLeaderById(game.winnerLeaderId))
			?.civilization_id;

	const update = {
		id: gameId,
		finished: game.finished,
		date: game.date,
		name: game.name,
		map: game.map,
		map_size: game.mapSize,
		speed: game.speed,
		turns: game.turns,
		winner_player: game.winnerPlayer,
		winner_leader_id: game.winnerLeaderId,
		winner_civilization_id: winnerCivilizationId || undefined,
		victory_id: game.victoryId || undefined,
	} as TablesUpdate<"game">;

	const updatedGame = await updateGameById(update);

	// Delete & re-create player, expansion, and gamemode
	await Promise.all([
		removeGamePlayerByGameId(gameId),
		game.expansions ? await removeGameExpansionByGameId(gameId) : null,
		game.gamemodes ? await removeGameGamemodesByGameId(gameId) : null,
	]);

	await Promise.all([
		createGamePlayers(gameId, game.players),
		game.expansions
			? await createGameExpansions(gameId, game.expansions)
			: null,
		game.gamemodes
			? await createGameGamemodes(gameId, game.gamemodes)
			: null,
	]);

	return updatedGame;
}

export async function fetchAllGamesByPlayer(player: string) {
	const games = await getAllGamesPlayedByPlayer(player);

	if (!games) throw new AppError("No games for player found", 404, "");

	const gameIds: Array<string> = games.map((game) => {
		return game.game.id;
	});

	return await getGamesById(gameIds);
}
