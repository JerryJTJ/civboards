import { ERROR_CODES } from "../../types/errorCodes";
import {
	fetchAllCivilizations,
	fetchCivilizationByCode,
	fetchCivilizationById,
} from "../services/civilization.service";

export async function handleGetCivilizationByCode(req, res, next) {
	const { code } = req.params;

	try {
		const civ = await fetchCivilizationByCode(code);
		return res.status(200).json(civ);
	} catch (error) {
		next(error);
	}
}

export async function handleGetCivilizationById(req, res, next) {
	const { id } = req.params;

	try {
		const civ = await fetchCivilizationById(id);
		return res.status(200).json(civ);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllCivilizations(req, res, next) {
	try {
		const civs = await fetchAllCivilizations();
		return res.status(200).json(civs);
	} catch (error) {
		next(error);
	}
}
