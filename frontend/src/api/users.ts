import {
	DisplayGameSchema,
	DisplayGameSchemaArray,
	ProfileSchema,
} from "@civboards/schemas";
import * as z from "zod";

import { instance } from "./axiosInstance";

export async function getProfile(
	username: string
): Promise<z.infer<typeof ProfileSchema>> {
	try {
		const response = await instance({
			url: `/player/name/${username}`,
			method: "get",
		});

		if (response.status === 200) {
			const validate = ProfileSchema.safeParse(response.data);
			if (validate.success) return validate.data;
		}
	} catch (error) {
		console.error(`Failed to get profile ${username}`);
	}

	throw new Error(`Failed to get profile ${username}`);
}

export async function getGamesByPlayer(
	username: string
): Promise<z.infer<typeof DisplayGameSchemaArray>> {
	try {
		const response = await instance({
			url: `/game/player/${username}`,
			method: "get",
		});

		if (response.status === 200) {
			const validate = DisplayGameSchemaArray.safeParse(response.data);
			if (validate.success) return validate.data;
		}
	} catch (error) {
		console.error(`Failed to get games for ${username}`);
	}

	return [] as z.infer<typeof DisplayGameSchema>[];
}

export async function getGamesByUploader(
	username: string
): Promise<z.infer<typeof DisplayGameSchemaArray>> {
	try {
		const response = await instance({
			url: `/game/uploader/${username}`,
			method: "get",
		});

		if (response.status === 200) {
			const validate = DisplayGameSchemaArray.safeParse(response.data);
			if (validate.success) return validate.data;
		}
	} catch {
		console.error(`Failed to get games for ${username}`);
	}

	return [] as z.infer<typeof DisplayGameSchema>[];
}

export async function getAllUsers(): Promise<{ name: string }[]> {
	try {
		const response = await instance({
			url: "/player/all",
			method: "get",
		});

		if (response.status === 200)
			return response.data as Array<{ name: string }>;
	} catch (error) {
		console.error("Failed to get users");
	}

	return [] as { name: string }[];
}
