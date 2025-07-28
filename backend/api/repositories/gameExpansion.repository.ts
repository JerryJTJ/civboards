import { TablesInsert } from "../../interfaces/supabase";
import { throwDatabaseError, throwNotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertExpansions(
	expansions: Array<TablesInsert<"game_expansion">>
) {
	const { data, error } = await supabase
		.from("game_expansion")
		.insert(expansions)
		.select();

	if (error) throwDatabaseError(error);
	if (!data) throwNotFoundError();

	return data;
}
