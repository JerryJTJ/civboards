import { DisplayGameSchemaArray, InsertGameSchema } from "@civboards/schemas";
import * as z from "zod";
import { instance } from "./axiosInstance";

export async function insertGame(
	game: z.infer<typeof InsertGameSchema>
): Promise<void> {
	await instance({
		url: "/game/add",
		method: "post",
		data: game,
		headers: { "Content-Type": "application/json" },
	});
}

export async function getAllGames(): Promise<
	z.infer<typeof DisplayGameSchemaArray> | undefined
> {
	const response = await instance({
		url: "/game/all",
		method: "get",
	});
	if (response.status === 200) {
		return response.data;
	}
}

export async function getGameByGameId(id: number) {
	const response = await instance({
		url: `/game/id/${id}`,
		method: "get",
	});
	if (response.status === 200) return response.data;
}

export async function deleteGameById(id: number): Promise<void> {
	await instance({
		url: `game/id/${id}`,
		method: "delete",
	});
}
