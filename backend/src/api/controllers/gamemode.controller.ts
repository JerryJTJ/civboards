import {
	fetchAllGamemodes,
	fetchGamemodeById,
} from "../services/gamemode.service.js";
import { Request, Response, NextFunction } from "express";

export async function handleGetGamemodeById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;
	try {
		const gamemode = await fetchGamemodeById(Number(id));
		return res.status(200).json(gamemode);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGamemodes(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const gamemodes = await fetchAllGamemodes();
		return res.status(200).json(gamemodes);
	} catch (error) {
		next(error);
	}
}
