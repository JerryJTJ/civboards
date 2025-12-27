import { TablesInsert } from "../../interfaces/supabase.js";
import { ValidationError } from "../../types/Errors.js";
import { doesGameIdExist } from "../repositories/game.repository.js";
import {
	deleteGameModsByGameId,
	getGameModsByGameId,
	insertMods,
} from "../repositories/gameMod.repository.js";

export async function createGameMods(gameId: string, mods: string[]) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameMods = mods.map((mod) => {
		return { game_id: gameId, name: mod };
	}) as TablesInsert<"game_mod">[];

	await insertMods(gameMods);
}

export async function fetchGameModsByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameMods = await getGameModsByGameId(gameId);
	const gameModNames = gameMods.map((mod) => {
		return mod.name;
	});

	return gameModNames.sort();
}

export async function removeGameModsByGameId(gameId: string) {
	await deleteGameModsByGameId(gameId);
}
