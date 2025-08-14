import { TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertGamePlayers(
	players: Array<TablesInsert<"game_player">>
) {
	const { data, error } = await supabase
		.from("game_player")
		.insert(players)
		.select();

	if (error) throwDatabaseError("Failed to insert game players", error);

	if (!data) throwNotFoundError();

	return data;
}

export async function getGamePlayersByGameId(gameId: number) {
	const { data, error } = await supabase
		.from("game_player")
		.select()
		.eq("game_id", gameId);

	if (error)
		throwDatabaseError("Failed to get game players by game id", error);
	if (!data) throwNotFoundError();

	return data;
}
