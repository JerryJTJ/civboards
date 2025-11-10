import { TablesInsert } from "../../interfaces/supabase.js";
import { DatabaseError } from "../../types/Errors.js";
import { supabase } from "../server.js";

export async function insertExpansions(
	expansions: TablesInsert<"game_expansion">[]
) {
	const { data, error } = await supabase
		.from("game_expansion")
		.insert(expansions)
		.select();

	if (error)
		throw new DatabaseError("Failed to insert game expansion", error);

	return data;
}

export async function getGameExpansionsByGameId(gameId: string) {
	const { data, error } = await supabase
		.from("game_expansion")
		.select()
		.eq("game_id", gameId);

	if (error)
		throw new DatabaseError(
			"Failed to get game expansions by game id",
			error
		);

	return data;
}

export async function deleteGameExpansionsByGameId(gameId: string) {
	const response = await supabase
		.from("game_expansion")
		.delete()
		.in("game_id", [gameId]);

	if (response.error)
		throw new DatabaseError(
			"Failed delete game expansions",
			response.error
		);
}
