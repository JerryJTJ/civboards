import { Database } from "../../interfaces/supabase";
import { supabase } from "../server";

export async function getCivilizationIdByCode(code: string) {
	const { data, error } = await supabase
		.from("civilization")
		.select("id")
		.eq("code", code)
		.maybeSingle();

	if (error) throw new Error(JSON.stringify(error));

	if (data)
		if (data.id) {
			return data.id;
		}
}

export async function getCivilizationNameById(id: number) {
	const { data, error } = await supabase
		.from("civilization")
		.select("name")
		.eq("id", id)
		.maybeSingle();

	if (error) throw new Error(JSON.stringify(error));

	if (data)
		if (data.name) {
			return data.name;
		}
}
