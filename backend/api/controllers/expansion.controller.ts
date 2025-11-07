import {
	fetchAllExpansions,
	fetchExpansionByCode,
	fetchExpansionById,
} from "../services/expansion.service";
import { Request, Response, NextFunction } from "express";

export async function handleGetExpansionByCode(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { code } = req.params;

	try {
		const expansion = await fetchExpansionByCode(code);
		return res.status(200).json(expansion);
	} catch (error) {
		next(error);
	}
}

export async function handleGetExpansionById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const expansion = await fetchExpansionById(Number(id));
		return res.status(200).json(expansion);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllExpansions(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const expansions = await fetchAllExpansions();
		return res.status(200).json(expansions);
	} catch (error) {
		next(error);
	}
}
