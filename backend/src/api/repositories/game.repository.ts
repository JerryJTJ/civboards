import { DatabaseError, ValidationError } from "../../types/Errors.js";
import {
	Tables,
	TablesInsert,
	TablesUpdate,
} from "../../interfaces/supabase.js";
import { supabase } from "../server.js";

export async function insertGame(
	game: TablesInsert<"game">
): Promise<Tables<"game">> {
	const { data, error } = await supabase
		.from("game")
		.insert({
			finished: game.finished,
			created_by: game.created_by,
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

	if (error) throw new DatabaseError("Failed to insert game", error);

	return data[0];
}

export async function doesGameIdExist(id: string) {
	const { data } = await supabase.from("game").select().eq("id", id);
	if (data?.length) return true;
	return false;
}

export async function getGameById(id: string) {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("id", id)
		.eq("active", true)
		.single();

	if (error) throw new DatabaseError("Failed to get game", error);

	return data;
}

export async function getGamesById(ids: string[]) {
	const { data, error } = await supabase
		.from("game")
		.select()
		.in("id", ids)
		.eq("active", true);

	if (error) throw new DatabaseError("Failed to get game", error);

	return data;
}

export async function getGamesByCreatedBy(createdBy: string) {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("created_by", createdBy);

	if (error) throw new DatabaseError("Failed to get games", error);

	return data;
}

export async function getAllGames() {
	const { data, error } = await supabase
		.from("game")
		.select()
		.eq("active", true);

	if (error) throw new DatabaseError("Failed to get all games", error);

	return data;
}

export async function deleteGameById(id: string) {
	const response = await supabase
		.from("game")
		.delete()
		.eq("id", id)
		.eq("active", true);

	if (response.error)
		throw new DatabaseError("Failed to delete game", response.error);
}

export async function softDeleteGameById(id: string): Promise<void> {
	const response = await supabase
		.from("game")
		.update({ active: false })
		.eq("id", id);

	if (response.error)
		throw new DatabaseError("Failed to delete game", response.error);
}

export async function getAllGameWinners() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_player")
		.eq("active", true)
		.eq("finished", true);

	if (error) throw new DatabaseError("Failed to get winners", error);

	return data;
}

export async function getAllGameWinnerLeaderIds() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_leader_id")
		.eq("active", true)
		.eq("finished", true);

	if (error)
		throw new DatabaseError("Failed to get game winner leaders", error);

	return data;
}

export async function getAllGameWinnerCivilizationIds() {
	const { data, error } = await supabase
		.from("game")
		.select("winner_civilization_id")
		.eq("active", true)
		.eq("finished", true);

	if (error)
		throw new DatabaseError("Failed to get game winner civiliations", error);

	return data;
}

export async function getAllGameVictoryIds() {
	const { data, error } = await supabase
		.from("game")
		.select("victory_id")
		.eq("active", true)
		.eq("finished", true);

	if (error) throw new DatabaseError("Failed to get game victories", error);

	return data;
}

export async function updateGameById(game: TablesUpdate<"game">) {
	if (game.id) {
		const id = game.id;

		const { data, error } = await supabase
			.from("game")
			.update(game)
			.eq("id", id)
			.select();

		if (error) throw new DatabaseError("Failed to update game", error);

		return data;
	}
	throw new ValidationError("Invalid game id");
}

export async function getGameWinsByPlayer(winner: string) {
	const { data, error } = await supabase
		.from("game")
		.select(
			`
			leader (name),
			civilization (name)
		`
		)
		.eq("finished", true)
		.eq("active", true)
		.eq("winner_player", winner)
		.not("winner_leader_id", "is", null)
		.not("winner_civilization_id", "is", null);

	if (error)
		throw new DatabaseError("Failed to get game wins by winner player", error);

	return data
		.map((win) => {
			return {
				leader: win.leader?.name,
				civilization: win.civilization?.name,
			};
		})
		.filter(
			(win) => win.civilization !== undefined && win.leader !== undefined
		) as unknown as Promise<
		{
			leader: string;
			civilization: string;
		}[]
	>;
}

export async function hasUserUploaded(user: string): Promise<boolean> {
	const { data, error } = await supabase
		.from("game")
		.select("id")
		.eq("created_by", user)
		.eq("active", true);

	if (error) throw new DatabaseError("Error", error);

	if (data.length > 0) return true;
	return false;
}
