import {
	AppError,
	throwDatabaseError,
	throwNotFoundError,
} from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import { supabase } from "../server";

export async function getExpansionByCode(code: string) {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.eq("code", code)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get expansion by code", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getExpansionById(id: number) {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.eq("id", id)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get expansion by id", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllExpansions() {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.order("id", { ascending: true });

	if (error) throwDatabaseError("Failed to get all expansions", error);
	if (!data) throwNotFoundError();

	return data;
}
