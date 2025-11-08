import { DatabaseError, NotFoundError } from "../../types/Errors.js";
import { supabase } from "../server.js";

export async function getVictoryFromId(id: number) {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.eq("id", id)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get victory from id", error);

	return data;
}

export async function getAllVictories() {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.order("id", { ascending: true });

	if (error) throw new DatabaseError("Failed to get all victories", error);
	if (data.length === 0) throw new NotFoundError();

	return data;
}
