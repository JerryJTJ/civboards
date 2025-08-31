import { TablesInsert } from "../../interfaces/supabase";
import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertGamePlayers(
	players: Array<TablesInsert<"game_player">>
) {
	const { data, error } = await supabase
		.from("game_player")
		.insert(players)
		.select();

	if (error) throw new DatabaseError("Failed to insert game players", error);

	if (!data) throw new NotFoundError();

	return data;
}

export async function getGamePlayersByGameId(gameId: string) {
	const { data, error } = await supabase
		.from("game_player")
		.select()
		.eq("game_id", gameId);

	if (error)
		throw new DatabaseError("Failed to get game players by game id", error);
	if (!data) throw new NotFoundError();

	return data;
}

export async function deleteGamePlayersByGameId(gameId: string) {
	const response = await supabase
		.from("game_player")
		.delete()
		.in("game_id", [gameId]);

	if (response.error)
		throw new DatabaseError("Failed delete game players", response.error);
}
