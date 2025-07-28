import { Database, Tables, TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertGame(game: TablesInsert<"game">) {
	const { data, error } = await supabase
		.from("game")
		.insert({
			map: game.map,
			map_size: game.map_size,
			speed: game.speed,
			turns: game.turns,
			winner_player: game.winner_player,
			winner_leader_id: game.winner_leader_id,
			winner_civilization_id: game.winner_civilization_id,
			is_finished: game.is_finished,
			victory_id: game.victory_id,
		})
		.select();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function doesGameIdExist(id: number) {
	const { data, error } = await supabase.from("game").select().eq("id", id);

	if (error) throwDatabaseError(error);

	if (data?.length) return true;
	return false;
}

export async function getGameById(id: number) {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("id", id)
		.single();

	if (error || !data) throwDatabaseError(error);

	return data;
}

export async function getAllGames() {
	const { data, error } = await supabase.from("game").select();

	if (error || !data?.length) throwDatabaseError(error);

	return data;
}
