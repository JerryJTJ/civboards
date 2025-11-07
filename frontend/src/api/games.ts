import {
	DisplayGameSchema,
	DisplayGameSchemaArray,
	InsertGameSchema,
	UpdateGameSchema,
} from "@civboards/schemas";
import * as z from "zod";

import { instance } from "./axiosInstance";
import useAccessToken from "./useAccessToken";

export function useGamesAPI() {
	const getToken = useAccessToken();

	// Protected Routes
	const insertGame = async (
		game: z.infer<typeof InsertGameSchema>
	): Promise<void> => {
		const token = await getToken();

		if (!token) throw new Error("You do not have permission to do this");

		await instance({
			url: "/game/add",
			method: "post",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: game,
		});
	};

	const updateGame = async (
		game: z.infer<typeof UpdateGameSchema>
	): Promise<void> => {
		const token = await getToken();

		if (!token) throw new Error("You do not have permission to do this");

		await instance({
			url: `/game/id/${game.id}`,
			method: "patch",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: game,
		});
	};

	const deleteGameById = async (id: string): Promise<void> => {
		const token = await getToken();

		if (!token) throw new Error("You do not have permission to do this");

		await instance({
			url: `game/id/${id}`,
			method: "delete",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};

	// Public routes
	const getAllGames = async (): Promise<
		z.infer<typeof DisplayGameSchemaArray> | undefined
	> => {
		const response = await instance({
			url: "/game/all",
			method: "get",
		});

		if (response.status === 200) {
			return response.data as z.infer<typeof DisplayGameSchemaArray>;
		}
	};

	const getGameByGameId = async (
		id: string
	): Promise<z.infer<typeof DisplayGameSchema> | undefined> => {
		const response = await instance({
			url: `/game/id/${id}`,
			method: "get",
		});

		if (response.status === 200)
			return response.data as z.infer<typeof DisplayGameSchema>;
	};

	return {
		insertGame,
		updateGame,
		deleteGameById,
		getAllGames,
		getGameByGameId,
	};
}
