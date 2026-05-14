import { TablesInsert } from "../interfaces/supabase.js";
import { DatabaseError } from "../../../types/Errors.js";
import { supabase } from "../../server.js";

export async function insertMods(mods: TablesInsert<"game_mod">[]) {
	const { data, error } = await supabase.from("game_mod").insert(mods).select();

	if (error) throw new DatabaseError("Failed to insert game mods", error);

	return data;
}

export async function getGameModsByGameId(gameId: string) {
	const { data, error } = await supabase
		.from("game_mod")
		.select()
		.eq("game_id", gameId);

	if (error)
		throw new DatabaseError("Failed to get game mods by game id", error);

	return data;
}

export async function deleteGameModsByGameId(gameId: string) {
	const response = await supabase
		.from("game_mod")
		.delete()
		.in("game_id", [gameId]);

	if (response.error)
		throw new DatabaseError("Failed delete game mods", response.error);
}
