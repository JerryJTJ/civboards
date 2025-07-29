import { throwValidationError } from "../../types/Errors";
import {
	getAllLeaders,
	getLeaderByCode,
	getLeaderById,
} from "../repositories/leader.repository";

export async function fetchLeaderFromCode(code: string) {
	if (!code || typeof code !== "string") {
		throwValidationError("Invalid Civilization Code");
	}

	const leader = await getLeaderByCode(code);
	return leader;
}

export async function fetchLeaderById(id: number) {
	if (!id || isNaN(id)) {
		throwValidationError("Invalid Leader Id");
	}
	const leader = await getLeaderById(id);
	return leader;
}

export async function fetchAllLeaders() {
	const leaders = await getAllLeaders();
	return leaders;
}
