import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getCivilizationByCode(code: string) {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.eq("code", code)
		.maybeSingle();

	if (error)
		throw new DatabaseError("Failed to get civilization by code", error);
	if (!data) throw new NotFoundError();

	return data;
}

export async function getCivilizationById(id: number) {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.eq("id", id)
		.maybeSingle();

	if (error)
		throw new DatabaseError("Failed to get civilization by id", error);
	if (!data) throw new NotFoundError();

	return data;
}

export async function getAllCivilizations() {
	const { data, error } = await supabase
		.from("civilization")
		.select()
		.order("name", { ascending: true });

	if (error)
		throw new DatabaseError("Failed to get all civilizations", error);
	if (!data) throw new NotFoundError();

	return data;
}
