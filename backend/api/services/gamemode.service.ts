import { ValidationError } from "../../types/Errors";
import {
	getAllGamemodes,
	getGamemodeById,
} from "../repositories/gamemode.respository";

export async function fetchGamemodeById(id: number) {
	if (!id || isNaN(id)) {
		throw new ValidationError("Invalid Victory Id");
	}
	const gamemode = await getGamemodeById(id);
	return gamemode;
}

export async function fetchAllGamemodes() {
	const gamemodes = await getAllGamemodes();
	return gamemodes;
}
