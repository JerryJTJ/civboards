import { TablesInsert } from "../../interfaces/supabase";
import { DatabaseError, NotFoundError } from "../../types/Errors";
import { supabase } from "../server";

export async function insertUser(user: TablesInsert<"user">) {
	const { data, error } = await supabase.from("user").insert(user).select();

	if (error) throw new DatabaseError("Failed to insert user", error);

	return data;
}

export async function getUserById(id: string) {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("id", id)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get user by id", error);

	return data;
}

export async function getUserByName(name: string) {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("name", name)
		.limit(1)
		.single();

	if (error) throw new DatabaseError("Failed to get user by name", error);

	return data;
}

export async function getAllUsers() {
	const { data, error } = await supabase.from("user").select("name");

	if (error) throw new DatabaseError("Failed to get user by id", error);
	if (data.length === 0) throw new NotFoundError();

	return data;
}
