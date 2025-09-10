import { Request, Response, NextFunction } from "express";
import { fetchAllUsers } from "../services/user.service";

export async function handleGetAllUsers(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const users = await fetchAllUsers();

		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
}
