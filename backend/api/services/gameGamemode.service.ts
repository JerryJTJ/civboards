import { TablesInsert } from "../../interfaces/supabase";
import { ValidationError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	deleteGameGamemodesById,
	getGameGamemodesByGameId,
	insertGamemodes,
} from "../repositories/gameGamemode.repository";

export async function createGameGamemodes(
	gameId: string,
	gamemodes: Array<number>
) {
	if (!gameId) throw new ValidationError("No Game Id Provided");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

	const gameGamemodes = gamemodes.map((gamemode) => {
		return { game_id: gameId, gamemode_id: gamemode };
	}) as Array<TablesInsert<"game_gamemode">>;
	insertGamemodes(gameGamemodes);
}

export async function fetchGameGamemodesIdsByGameId(gameId: string) {
	if (!gameId) throw new ValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throw new ValidationError("Invalid Game Id");

	const gameGamemodes = await getGameGamemodesByGameId(gameId);
	const gameGamemodesIds = gameGamemodes?.map((gameGamemode) => {
		return gameGamemode.gamemode_id;
	});

	return gameGamemodesIds;
}

export async function removeGameGamemodesByGameId(gameId: string) {
	await deleteGameGamemodesById(gameId);
}
