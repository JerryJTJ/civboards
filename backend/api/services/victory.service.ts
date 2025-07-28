import { throwValidationError } from "../../types/Errors";
import {
	getAllVictories,
	getVictoryFromId,
} from "../repositories/victory.repository";

export async function fetchVictoryById(id: number) {
	if (!id || isNaN(id)) {
		throwValidationError("Invalid Victory Id");
	}
	const victory = await getVictoryFromId(id);
	return victory;
}

export async function fetchAllVictories() {
	const victories = await getAllVictories();
	return victories;
}
