import { ValidationError } from "../../types/Errors";
import {
	getAllExpansions,
	getExpansionByCode,
	getExpansionById,
} from "../repositories/expansion.repository";

export async function fetchExpansionByCode(code: string) {
	if (!code || typeof code !== "string") {
		throw new ValidationError("Invalid Expansion code");
	}

	const expansion = await getExpansionByCode(code);
	return expansion;
}

export async function fetchExpansionById(id: number) {
	if (!id || isNaN(id)) {
		throw new ValidationError("Invalid Expansion Id");
	}

	const expansion = await getExpansionById(id);
	return expansion;
}

export async function fetchAllExpansions() {
	const expansions = await getAllExpansions();
	return expansions;
}
