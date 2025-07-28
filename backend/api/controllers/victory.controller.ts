import {
	fetchAllVictories,
	fetchVictoryById,
} from "../services/victory.service";

export async function handleGetVictoryById(req, res, next) {
	const { id } = req.params;

	try {
		const victory = await fetchVictoryById(id);
		return res.status(200).json(victory);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllVictories(req, res, next) {
	try {
		const victories = await fetchAllVictories();
		return res.status(200).json(victories);
	} catch (error) {
		next(error);
	}
}
