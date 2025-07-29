import { Database } from "../../interfaces/supabase";
import {
	AppError,
	throwDatabaseError,
	throwNotFoundError,
} from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import { supabase } from "../server";

export async function getCivilizationByCode(code: string) {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.eq("code", code)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get civilization by code", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getCivilizationById(id: number) {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.eq("id", id)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get civilization by id", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllCivilizations() {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.order("name", { ascending: true });

	if (error) throwDatabaseError("Failed to get all civilizations", error);
	if (!data) throwNotFoundError();

	return data;
}
