import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getVictoryFromId(id: number) {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.eq("id", id)
		.maybeSingle();

	if (error) throw new DatabaseError("Failed to get victory from id", error);
	if (!data) throw new NotFoundError();

	return data;
}

export async function getAllVictories() {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.order("id", { ascending: true });

	if (error) throw new DatabaseError("Failed to get all victories", error);
	if (!data) throw new NotFoundError();

	return data;
}
