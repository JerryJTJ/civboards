import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getGamemodeById(id: number) {
	const { data, error } = await supabase
		.from("gamemode")
		.select("id, name")
		.eq("id", id)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get gamemode from id", error);

	return data;
}

export async function getAllGamemodes() {
	const { data, error } = await supabase
		.from("gamemode")
		.select("id, name")
		.order("id", { ascending: true });

	if (error) throw new DatabaseError("Failed to get all gamemodes", error);
	if (data.length === 0) throw new NotFoundError();

	return data;
}
