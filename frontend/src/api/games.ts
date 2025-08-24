import { DisplayGameSchemaArray, InsertGameSchema } from "@civboards/schemas";
import * as z from "zod";
import { instance } from "./axiosInstance";

export async function insertGame(
	game: z.infer<typeof InsertGameSchema>
): Promise<boolean> {
	try {
		const response = await instance({
			url: "/game/add",
			method: "post",
			data: game,
			headers: { "Content-Type": "application/json" },
		});
		if (response.status === 200) return true;
		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function getAllGames(): Promise<
	z.infer<typeof DisplayGameSchemaArray> | undefined
> {
	try {
		const response = await instance({
			url: "/game/all",
			method: "get",
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error);
	}
}

export async function getGameByGameId(id: number) {
	try {
		const response = await instance({
			url: `/game/id/${id}`,
			method: "get",
		});
		if (response.status === 200) return response.data;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function getAllGameWinners(): Promise<
	Array<{ player: string; wins: number }> | undefined
> {
	try {
		const response = await instance({
			url: "/game/winners",
			method: "get",
		});
		if (response.status === 200) return response.data;
	} catch (error) {
		console.log(error);
	}
}
