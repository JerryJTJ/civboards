import {
	fetchAllGamemodes,
	fetchGamemodeById,
} from "../services/gamemode.service";

export async function handleGetGamemodeById(req, res, next) {
	const { id } = req.params;
	try {
		const gamemode = await fetchGamemodeById(id);
		return res.status(200).json(gamemode);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGamemodes(req, res, next) {
	try {
		const gamemodes = await fetchAllGamemodes();
		return res.status(200).json(gamemodes);
	} catch (error) {
		next(error);
	}
}
