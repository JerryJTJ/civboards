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
	if (!data) throw new NotFoundError();

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
		.select(`game!inner (active)`)
		.eq("game.active", true)
		.eq("name", name)
		.eq("is_human", true);

	if (error) throw new DatabaseError("Failed to get game count", error);
	if (!data) throw new NotFoundError();

	return data.length;
}
