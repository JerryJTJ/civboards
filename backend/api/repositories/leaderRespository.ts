import { Database } from "../../interfaces/supabase";
import { AppError } from "../../types/Errors";
import { ERROR_CODES } from "../../types/errorCodes";
import { supabase } from "../server";

export async function getLeaderByCode(code: string) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name")
		.eq("code", code)
		.eq("active", true)
		.maybeSingle();

	if (error)
		throw new AppError(
			error.message,
			400,
			ERROR_CODES.DATABASE.INVALID_QUERY
		);

	if (!data)
		throw new AppError(
			"Resource not found",
			404,
			ERROR_CODES.DATABASE.NOT_FOUND
		);

	return data;
}

export async function getLeaderById(id: number) {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name")
		.eq("id", id)
		.eq("active", true)
		.maybeSingle();

	if (error)
		throw new AppError(
			error.message,
			400,
			ERROR_CODES.DATABASE.INVALID_QUERY
		);

	if (!data)
		throw new AppError(
			"Resource not found",
			404,
			ERROR_CODES.DATABASE.NOT_FOUND
		);

	return data;
}

export async function getAllLeaders() {
	const { data, error } = await supabase
		.from("leader")
		.select("id, name, civilization")
		.eq("active", true)
		.order("name", { ascending: true });

	if (error)
		throw new AppError(
			error.message,
			400,
			ERROR_CODES.DATABASE.INVALID_QUERY
		);

	if (!data)
		throw new AppError(
			"Resource not found",
			404,
			ERROR_CODES.DATABASE.NOT_FOUND
		);

	return data;
}
