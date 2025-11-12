import { ValidationError } from "../../types/Errors.js";
import {
	getAllCivilizations,
	getCivilizationByCode,
	getCivilizationById,
} from "../repositories/civilization.repository.js";

export async function fetchCivilizationByCode(code: string) {
	if (!code || typeof code !== "string") {
		throw new ValidationError("Invalid Civilization code");
	}

	const civ = await getCivilizationByCode(code);
	return civ;
}

export async function fetchCivilizationById(id: number) {
	if (!id || isNaN(id)) {
		throw new ValidationError("Invalid Civilization Id");
	}
	const civ = await getCivilizationById(id);
	return civ;
}

export async function fetchAllCivilizations() {
	const civs = await getAllCivilizations();
	return civs;
}
