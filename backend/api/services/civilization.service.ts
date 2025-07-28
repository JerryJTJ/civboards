import { AppError, throwValidationError } from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import {
	getAllCivilizations,
	getCivilizationByCode,
	getCivilizationById,
} from "../repositories/civilization.repository";

export async function fetchCivilizationByCode(code: string) {
	if (!code || typeof code !== "string") {
		throwValidationError("Invalid Civilization code");
	}

	const civ = await getCivilizationByCode(code);
	return civ;
}

export async function fetchCivilizationById(id: number) {
	if (!id || isNaN(id)) {
		throwValidationError("Invalid Civilization Id");
	}
	const civ = await getCivilizationById(id);
	return civ;
}

export async function fetchAllCivilizations() {
	const civs = await getAllCivilizations();
	return civs;
}
