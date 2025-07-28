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

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getExpansionById(id: number) {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.eq("id", id)
		.maybeSingle();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllExpansions() {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.order("id", { ascending: true });

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
