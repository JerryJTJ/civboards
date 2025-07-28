import { throwValidationError } from "../../types/Errors";
import {
	getAllGamemodes,
	getGamemodeFromId,
} from "../repositories/gamemode.respository";

export async function fetchGamemodeById(id: number) {
	if (!id || isNaN(id)) {
		throwValidationError("Invalid Victory Id");
	}
	const gamemode = await getGamemodeFromId(id);
	return gamemode;
}

export async function fetchAllGamemodes() {
	const gamemodes = await getAllGamemodes();
	return gamemodes;
}
