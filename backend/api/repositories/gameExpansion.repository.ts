import { TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertExpansions(
	expansions: Array<TablesInsert<"game_expansion">>
) {
	const { data, error } = await supabase
		.from("game_expansion")
		.insert(expansions)
		.select();

	if (error) throwDatabaseError("Failed to insert game expansion", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getGameExpansionsByGameId(gameId: number) {
	const { data, error } = await supabase
		.from("game_expansion")
		.select()
		.eq("game_id", gameId);

	if (error)
		throwDatabaseError("Failed to get game expansions by game id", error);
	if (!data) throwNotFoundError();

	return data;
}
