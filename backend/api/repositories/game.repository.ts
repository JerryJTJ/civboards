import { TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertGame(game: TablesInsert<"game">) {
	const { data, error } = await supabase
		.from("game")
		.insert({
			finished: game.finished,
			date: game.date,
			name: game.name,
			map: game.map,
			map_size: game.map_size,
			speed: game.speed,
			turns: game.turns,
			winner_player: game.winner_player,
			winner_leader_id: game.winner_leader_id,
			winner_civilization_id: game.winner_civilization_id,
			victory_id: game.victory_id,
			active: true,
		})
		.select();

	if (error) throwDatabaseError("Failed to insert game", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function doesGameIdExist(id: number) {
	const { data } = await supabase.from("game").select().eq("id", id);
	if (data?.length) return true;
	return false;
}

export async function getGameById(id: number) {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("id", id)
		.eq("active", true)
		.single();

	if (error || !data) throwDatabaseError("Failed to get game", error);

	return data;
}

export async function getAllGames() {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("active", true);

	if (error || !data) throwDatabaseError("Failed to get all games", error);

	return data;
}

export async function deleteGameById(id: number) {
	const response = await supabase
		.from("game")
		.delete()
		.eq("id", id)
		.eq("active", true);

	if (response.error)
		throwDatabaseError("Failed to delete game", response.error);
}

export async function softDeleteGameById(id: number): Promise<void> {
	const response = await supabase
		.from("game")
		.update({ active: false })
		.eq("id", id);

	if (response.error)
		throwDatabaseError("Failed to delete game", response.error);
}

export async function getAllGameWinners() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_player")
		.eq("active", true)
		.eq("finished", true);

	if (error || !data) throwDatabaseError("Failed to get winners", error);

	return data;
}

export async function getAllGameWinnerLeaderIds() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_leader_id")
		.eq("active", true)
		.eq("finished", true);

	if (error || !data)
		throwDatabaseError("Failed to get game winner leaders", error);

	return data;
}

export async function getAllGameWinnerCivilizationIds() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_civilization_id")
		.eq("active", true)
		.eq("finished", true);

	if (error || !data)
		throwDatabaseError("Failed to get game winner civiliations", error);

	return data;
}

export async function getAllGameVictoryIds() {
	const { data, error } = await supabase
		.from("game")
		.select("victory_id")
		.eq("active", true)
		.eq("finished", true);

	if (error || !data)
		throwDatabaseError("Failed to get game victories", error);

	return data;
}
