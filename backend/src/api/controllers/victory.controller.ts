import { NextFunction, Request, Response } from "express";
import {
	fetchAllVictories,
	fetchVictoryById,
} from "../services/victory.service.js";

export async function handleGetVictoryById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const victory = await fetchVictoryById(Number(id));
		return res.status(200).json(victory);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllVictories(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const victories = await fetchAllVictories();
		return res.status(200).json(victories);
	} catch (error) {
		next(error);
	}
}
