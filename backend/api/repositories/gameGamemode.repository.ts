import { TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertGamemodes(
	gamemodes: Array<TablesInsert<"game_gamemode">>
) {
	const { data, error } = await supabase
		.from("game_gamemode")
		.insert(gamemodes)
		.select();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getGameGamemodesByGameId(gameId: number) {
	const { data, error } = await supabase
		.from("game_gamemode")
		.select("gamemode_id")
		.eq("game_id", gameId);

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
