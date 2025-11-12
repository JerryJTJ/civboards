import { TablesInsert } from "../../interfaces/supabase.js";
import { DatabaseError } from "../../types/Errors.js";
import { supabase } from "../server.js";

export async function insertGamemodes(
	gamemodes: TablesInsert<"game_gamemode">[]
) {
	const { data, error } = await supabase
		.from("game_gamemode")
		.insert(gamemodes)
		.select();

	if (error) throw new DatabaseError("Failed to insert game gamemode", error);

	return data;
}

export async function getGameGamemodesByGameId(gameId: string) {
	const { data, error } = await supabase
		.from("game_gamemode")
		.select("gamemode_id")
		.eq("game_id", gameId);

	if (error)
		throw new DatabaseError("Failed to get game gamemodes by game id", error);

	return data;
}

export async function deleteGameGamemodesById(gameId: string) {
	const response = await supabase
		.from("game_gamemode")
		.delete()
		.in("game_id", [gameId]);

	if (response.error)
		throw new DatabaseError("Failed delete game gamemodes", response.error);
}
