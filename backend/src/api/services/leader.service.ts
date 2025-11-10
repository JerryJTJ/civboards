import { ValidationError } from "../../types/Errors.js";
import {
	getAllLeaders,
	getCivilizationIdByLeaderId,
	getLeaderByCode,
	getLeaderById,
} from "../repositories/leader.repository.js";

export async function fetchLeaderFromCode(code: string) {
	if (!code || typeof code !== "string") {
		throw new ValidationError("Invalid Civilization Code");
	}

	const leader = await getLeaderByCode(code);
	return leader;
}

export async function fetchLeaderById(id: number) {
	if (!id || isNaN(id)) {
		throw new ValidationError("Invalid Leader Id");
	}
	const leader = await getLeaderById(id);
	return leader;
}

export async function fetchCivilizationIdByLeaderId(id: number) {
	if (!id || isNaN(id)) {
		throw new ValidationError("Invalid Leader Id");
	}
	const civId = await getCivilizationIdByLeaderId(id);
	return civId;
}

export async function fetchAllLeaders() {
	const leaders = await getAllLeaders();
	return leaders;
}
