import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getExpansionByCode(code: string) {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.eq("code", code)
		.limit(1)
		.single();

	if (error)
		throw new DatabaseError("Failed to get expansion by code", error);

	return data;
}

export async function getExpansionById(id: number) {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.eq("id", id)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get expansion by id", error);

	return data;
}

export async function getAllExpansions() {
	const { data, error } = await supabase
		.from("expansion")
		.select("id, name")
		.order("id", { ascending: true });

	if (error) throw new DatabaseError("Failed to get all expansions", error);
	if (data.length === 0) throw new NotFoundError();

	return data;
}
