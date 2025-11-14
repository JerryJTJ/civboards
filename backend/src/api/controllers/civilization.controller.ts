import { NextFunction, Request, Response } from "express";
import {
	fetchAllCivilizations,
	fetchCivilizationByCode,
	fetchCivilizationById,
} from "../services/civilization.service.js";

export async function handleGetCivilizationByCode(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { code } = req.params;

	try {
		const civ = await fetchCivilizationByCode(code);
		return res.status(200).json(civ);
	} catch (error) {
		next(error);
	}
}

export async function handleGetCivilizationById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const civ = await fetchCivilizationById(Number(id));
		return res.status(200).json(civ);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllCivilizations(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const civs = await fetchAllCivilizations();
		return res.status(200).json(civs);
	} catch (error) {
		next(error);
	}
}
