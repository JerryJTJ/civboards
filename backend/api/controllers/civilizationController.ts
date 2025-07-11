import { fetchCivilizationByIdByCode } from "../services/civilizationService";

export async function handleGetCivilizationIdByCode(req, res) {
	const { code } = req.params;

	if (!code) {
		throw new Error("No code provided.");
	}

	const civId = await fetchCivilizationByIdByCode(code);
	return res.status(201).json({ id: civId });
}
