import { getCivilizationIdByCode } from "../repositories/civilizationRepository";

export async function fetchCivilizationByIdByCode(code: string) {
	if (!code || typeof code !== "string") {
		throw new Error("Invalid civilization code");
	}

	const civId = await getCivilizationIdByCode(code);
	if (!civId) {
		throw new Error(`Civilization not found for code: ${code}`);
	}

	return civId;
}
