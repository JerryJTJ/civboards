import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getGamemodeFromId(id: number) {
	const { data, error } = await supabase
		.from("gamemode")
		.select("id, name")
		.eq("id", id)
		.maybeSingle();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllGamemodes() {
	const { data, error } = await supabase
		.from("gamemode")
		.select("id, name")
		.order("id", { ascending: true });

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
