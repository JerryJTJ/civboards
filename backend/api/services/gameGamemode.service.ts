import { TablesInsert } from "../../interfaces/supabase";
import { throwValidationError, AppError } from "../../types/Errors";
import { doesGameIdExist } from "../repositories/game.repository";
import {
	deleteGameGamemodesById,
	getGameGamemodesByGameId,
	insertGamemodes,
} from "../repositories/gameGamemode.repository";

export async function createGameGamemodes(
	gameId: number,
	gamemodes: Array<number>
) {
	if (!gameId) throwValidationError("No Game Id Provided");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	const gameGamemodes = gamemodes.map((gamemode) => {
		return { game_id: gameId, gamemode_id: gamemode };
	}) as Array<TablesInsert<"game_gamemode">>;
	insertGamemodes(gameGamemodes);
}

export async function fetchGameGamemodesIdsByGameId(gameId: number) {
	if (!gameId) throwValidationError("Invalid Game Id");
	if (!doesGameIdExist(gameId)) throwValidationError("Invalid Game Id");

	const gameGamemodes = await getGameGamemodesByGameId(gameId);
	const gameGamemodesIds = gameGamemodes?.map((gameGamemode) => {
		return gameGamemode.gamemode_id;
	});

	return gameGamemodesIds;
}

export async function removeGameGamemodesByGameId(gameId: number) {
	await deleteGameGamemodesById(gameId);
}
