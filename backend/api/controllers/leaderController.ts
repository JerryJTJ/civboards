import {
	fetchLeaderFromCode,
	fetchLeaderById,
	fetchAllLeaders,
} from "../services/leaderService";

export async function handleGetLeaderByCode(req, res, next) {
	const { code } = req.params;

	try {
		const leader = await fetchLeaderFromCode(code);
		return res.status(200).json(leader);
	} catch (error) {
		next(error);
	}
}

export async function handleGetLeaderById(req, res, next) {
	const { id } = req.params;

	try {
		const leader = await fetchLeaderById(id);
		return res.status(200).json(leader);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllLeaders(req, res, next) {
	try {
		const leaders = await fetchAllLeaders();
		return res.status(200).json(leaders);
	} catch (error) {
		next(error);
	}
}
