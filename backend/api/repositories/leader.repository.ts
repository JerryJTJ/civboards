import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getLeaderByCode(code: string) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization_id")
		.eq("code", code)
		.eq("active", true)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get leader by code", error);

	return data;
}

export async function getLeaderById(id: number) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization_id")
		.eq("id", id)
		.eq("active", true)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get leader by id", error);

	return data;
}

export async function getCivilizationIdByLeaderId(id: number) {
	const { data, error } = await supabase
		.from("leader")
		.select("civilization_id")
		.eq("id", id)
		.eq("active", true)
		.limit(1)
		.single();

	if (error)
		throw new DatabaseError("Failed to get civilization by leader", error);

	return data;
}

export async function getAllLeaders() {
	const { data, error } = await supabase
		.from("leader")
		.select(`id, name, civilization (id, name)`)
		.eq("active", true)
		.order("name", { ascending: true });

	if (error) throw new DatabaseError("Failed to get all leaders", error);
	if (data.length === 0) throw new NotFoundError();

	return data;
}
