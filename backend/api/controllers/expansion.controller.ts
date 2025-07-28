import {
	fetchAllExpansions,
	fetchExpansionByCode,
	fetchExpansionById,
} from "../services/expansion.service";

export async function handleGetExpansionByCode(req, res, next) {
	const { code } = req.params;

	try {
		const expansion = await fetchExpansionByCode(code);
		return res.status(200).json(expansion);
	} catch (error) {
		next(error);
	}
}

export async function handleGetExpansionById(req, res, next) {
	const { id } = req.params;

	try {
		const expansion = await fetchExpansionById(id);
		return res.status(200).json(expansion);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllExpansions(req, res, next) {
	try {
		const expansions = await fetchAllExpansions();
		return res.status(200).json(expansions);
	} catch (error) {}
}
