import { TablesInsert } from "../../interfaces/supabase.js";
import { ValidationError } from "../../types/Errors.js";
import { doesGameIdExist } from "../repositories/game.repository.js";
import {
	deleteGameExpansionsByGameId,
	getGameExpansionsByGameId,
	insertExpansions,
} from "../repositories/gameExpansion.repository.js";

export async function createGameExpansions(
	gameId: string,
	expansions: number[]
) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameExpansions = expansions.map((expansion) => {
		return { game_id: gameId, expansion_id: expansion };
	}) as TablesInsert<"game_expansion">[];
	await insertExpansions(gameExpansions);
}

export async function fetchGameExpansionsIdsByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameExpansions = await getGameExpansionsByGameId(gameId);
	const gameExpansionsIds = gameExpansions.map(
		(gameExpansions) => gameExpansions.expansion_id
	);
	return gameExpansionsIds.sort();
}

export async function removeGameExpansionByGameId(gameId: string) {
	await deleteGameExpansionsByGameId(gameId);
}
