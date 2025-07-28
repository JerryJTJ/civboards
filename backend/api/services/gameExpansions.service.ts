import { TablesInsert } from "../../interfaces/supabase";
import { throwValidationError, throwDatabaseError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import { insertExpansions } from "../repositories/gameExpansion.repository";

export async function createGameExpansions(
	gameId: number,
	expansions: Array<number>
) {
	if (!gameId) throwValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	try {
		const gameExpansions = expansions.map((expansion) => {
			return { game_id: gameId, expansion_id: expansion };
		}) as Array<TablesInsert<"game_expansion">>;
		insertExpansions(gameExpansions);
	} catch (error) {
		throwDatabaseError("Failed to create expansions");
	}
}
