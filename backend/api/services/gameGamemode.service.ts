import { TablesInsert } from "../../interfaces/supabase";
import { ValidationError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	deleteGameGamemodesById,
	getGameGamemodesByGameId,
	insertGamemodes,
} from "../repositories/gameGamemode.repository";

export async function createGameGamemodes(gameId: string, gamemodes: number[]) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameGamemodes = gamemodes.map((gamemode) => {
		return { game_id: gameId, gamemode_id: gamemode };
	}) as TablesInsert<"game_gamemode">[];
	await insertGamemodes(gameGamemodes);
}

export async function fetchGameGamemodesIdsByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("Invalid Game Id");
	if (!(await doesGameIdExist(gameId)))
		throw new ValidationError("Invalid Game Id");

	const gameGamemodes = await getGameGamemodesByGameId(gameId);
	const gameGamemodesIds = gameGamemodes.map((gameGamemode) => {
		return gameGamemode.gamemode_id;
	});

	return gameGamemodesIds.sort();
}

export async function removeGameGamemodesByGameId(gameId: string) {
	await deleteGameGamemodesById(gameId);
}
