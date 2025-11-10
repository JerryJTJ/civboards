import { TablesInsert } from "../../interfaces/supabase.js";
import { DatabaseError, NotFoundError } from "../../types/Errors.js";
import { supabase } from "../server.js";

export async function getAllGamePlayers() {
	const { data, error } = await supabase
		.from("game_player")
		.select(
			`name, 
			game!inner (active)`
		)
		.neq("name", "")
		.not("name", "is", null)
		.eq("game.active", true);

	if (error)
		throw new DatabaseError("Failed to get all unique game players", error);

	return data;
}

export async function insertGamePlayers(
	players: TablesInsert<"game_player">[]
) {
	const { data, error } = await supabase
		.from("game_player")
		.insert(players)
		.select();

	if (error) throw new DatabaseError("Failed to insert game players", error);

	return data;
}

export async function getGamePlayersByGameId(gameId: string) {
	const { data, error } = await supabase
		.from("game_player")
		.select()
		.eq("game_id", gameId);

	if (error)
		throw new DatabaseError("Failed to get game players by game id", error);
	if (data.length === 0) throw new NotFoundError();

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

export async function getProfileInfoByName(name: string) {
	const { data, error } = await supabase
		.from("game_player")
		.select(
			`
			leader (name),
			civilization (name),
			game!inner (finished)
			`
		)
		.eq("name", name)
		.eq("game.finished", true)
		.eq("is_human", true);

	if (error) throw new DatabaseError("Failed to get profiles", error);
	if (data.length === 0) throw new NotFoundError();

	return data.map((play) => {
		return {
			leader: play.leader?.name,
			civilization: play.civilization?.name,
		};
	});
}

export async function getAllGamesPlayedByPlayer(name: string) {
	const { data, error } = await supabase
		.from("game_player")
		.select(`game!inner (id, active)`)
		.eq("game.active", true)
		.eq("name", name)
		.eq("is_human", true);

	if (error) throw new DatabaseError("Failed to get games", error);

	return data;
}
