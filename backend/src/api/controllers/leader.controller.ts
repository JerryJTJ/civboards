import {
	fetchLeaderFromCode,
	fetchLeaderById,
	fetchAllLeaders,
} from "../services/leader.service.js";
import { Request, Response, NextFunction } from "express";

export async function handleGetLeaderByCode(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { code } = req.params;

	try {
		const leader = await fetchLeaderFromCode(code);
		return res.status(200).json(leader);
	} catch (error) {
		next(error);
	}
}

export async function handleGetLeaderById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const leader = await fetchLeaderById(Number(id));
		return res.status(200).json(leader);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllLeaders(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const leaders = await fetchAllLeaders();
		return res.status(200).json(leaders);
	} catch (error) {
		next(error);
	}
}
