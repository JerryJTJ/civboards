import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../types/Errors.js";
import { getProfilePicByUsername, getUserByUsername } from "./users.service.js";

export async function handleGetPicFromUsername(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { username } = req.params;

	// Validate alphanumeric
	if (!username.match(/^[a-z0-9]+$/i))
		throw new ValidationError("Username must be alphanumeric");

	try {
		const pic = await getProfilePicByUsername(username);
		return res.status(200).json(pic);
	} catch (error) {
		next(error);
	}
}
