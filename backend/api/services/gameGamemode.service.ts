import { TablesInsert } from "../../interfaces/supabase";
import { throwValidationError, throwDatabaseError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	getGameGamemodesByGameId,
	insertGamemodes,
} from "../repositories/gameGamemode.repository";

export async function createGameGamemodes(
	gameId: number,
	gamemodes: Array<number>
) {
	if (!gameId) throwValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	try {
		const gameGamemodes = gamemodes.map((gamemode) => {
			return { game_id: gameId, gamemode_id: gamemode };
		}) as Array<TablesInsert<"game_gamemode">>;
		insertGamemodes(gameGamemodes);
	} catch (error) {
		throwDatabaseError("Failed to create gamemodes");
	}
}

export async function fetchGameGamemodesByGameId(gameId: number) {
	if (!gameId) throwValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	try {
		const gameGamemodes = await getGameGamemodesByGameId(gameId);
		const gameGamemodesIds = gameGamemodes?.map((gameGamemode) => {
			return gameGamemode.gamemode_id;
		});
		return gameGamemodesIds;
	} catch (error) {
		throwDatabaseError("Failed to fetch gamemodes");
	}
}
