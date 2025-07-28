import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function getVictoryFromId(id: number) {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.eq("id", id)
		.maybeSingle();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}

export async function getAllVictories() {
	const { data, error } = await supabase
		.from("victory")
		.select("id, type")
		.order("id", { ascending: true });

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
