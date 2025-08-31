import { TablesInsert } from "../../interfaces/supabase";
import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertExpansions(
	expansions: Array<TablesInsert<"game_expansion">>
) {
	const { data, error } = await supabase
		.from("game_expansion")
		.insert(expansions)
		.select();

	if (error)
		throw new DatabaseError("Failed to insert game expansion", error);
	if (!data) throw new NotFoundError();

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
	if (!data) throw new NotFoundError();

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
