import { InsertGameSchema } from "@civboards/schemas";
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
