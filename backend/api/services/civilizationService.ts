import { AppError } from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import {
	getAllCivilizations,
	getCivilizationByCode,
	getCivilizationById,
} from "../repositories/civilizationRepository";

export async function fetchCivilizationByCode(code: string) {
	if (!code || typeof code !== "string") {
		throw new AppError(
			"Invalid Civilization Code",
			422,
			ERROR_CODES.VALIDATION
		);
	}

	const civ = await getCivilizationByCode(code);
	return civ;
}

export async function fetchCivilizationById(id: number) {
	if (!id || isNaN(id)) {
		throw new AppError(
			"Invalid Civilization Name",
			422,
			ERROR_CODES.VALIDATION
		);
	}
	const civ = await getCivilizationById(id);
	return civ;
}

export async function fetchAllCivilizations() {
	const civs = await getAllCivilizations();
	return civs;
}
