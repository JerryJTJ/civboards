import { Database } from "../../interfaces/supabase";
import {
	AppError,
	throwDatabaseError,
	throwNotFoundError,
} from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import { supabase } from "../server";

export async function getLeaderByCode(code: string) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization")
		.eq("code", code)
		.eq("active", true)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get leader by code", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getLeaderById(id: number) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization")
		.eq("id", id)
		.eq("active", true)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get leader by id", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllLeaders() {
	const { data, error } = await supabase
		.from("leader")
		.select(`id, name, civilization (id, name)`)
		.eq("active", true)
		.order("name", { ascending: true });

	if (error) throwDatabaseError("Failed to get all leaders", error);
	if (!data) throwNotFoundError();

	return data;
}
