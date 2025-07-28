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

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
