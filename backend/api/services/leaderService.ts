import { AppError } from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import {
	getAllLeaders,
	getLeaderByCode,
	getLeaderById,
} from "../repositories/leaderRespository";

export async function fetchLeaderFromCode(code: string) {
	if (!code || typeof code !== "string") {
		let e = new Error();
		throw new AppError("Invalid Leader Code", 422, ERROR_CODES.VALIDATION);
	}

	const leader = await getLeaderByCode(code);
	return leader;
}

export async function fetchLeaderById(id: number) {
	if (!id || isNaN(id)) {
		throw new AppError("Invalid Leader Id", 422, ERROR_CODES.VALIDATION);
	}
	const leader = await getLeaderById(id);
	return leader;
}

export async function fetchAllLeaders() {
	const leaders = await getAllLeaders();
	return leaders;
}
