import { TablesInsert } from "../../interfaces/supabase";
import { ValidationError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	deleteGameExpansionsByGameId,
	getGameExpansionsByGameId,
	insertExpansions,
} from "../repositories/gameExpansion.repository";

export async function createGameExpansions(
	gameId: string,
	expansions: Array<number>
) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

	const gameExpansions = expansions.map((expansion) => {
		return { game_id: gameId, expansion_id: expansion };
	}) as Array<TablesInsert<"game_expansion">>;
	insertExpansions(gameExpansions);
}

export async function fetchGameExpansionsIdsByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

	const gameExpansions = await getGameExpansionsByGameId(gameId);
	const gameExpansionsIds = gameExpansions?.map(
		(gameExpansions) => gameExpansions.expansion_id
	);
	return gameExpansionsIds;
}

export async function removeGameExpansionByGameId(gameId: string) {
	await deleteGameExpansionsByGameId(gameId);
}
