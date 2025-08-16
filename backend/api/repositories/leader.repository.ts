import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getLeaderByCode(code: string) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization_id")
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
		.select("id, name, civilization_id")
		.eq("id", id)
		.eq("active", true)
		.maybeSingle();

	if (error) throwDatabaseError("Failed to get leader by id", error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getCivilizationIdByLeaderId(id: number) {
	const { data, error } = await supabase
		.from("leader")
		.select("civilization_id")
		.eq("id", id)
		.eq("active", true)
		.maybeSingle();

	if (error)
		throwDatabaseError("Failed to get civilization by leader", error);
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
