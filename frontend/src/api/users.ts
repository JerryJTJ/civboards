import { DisplayGameSchemaArray, ProfileSchema } from "@civboards/schemas";
import * as z from "zod";

import { instance } from "./axiosInstance";

export async function getProfile(
	username: string
): Promise<z.infer<typeof ProfileSchema> | undefined> {
	const response = await instance({
		url: `/player/name/${username}`,
		method: "get",
	});

	if (response.status === 200) {
		const validate = ProfileSchema.safeParse(response.data);

		if (validate.success) return validate.data;
	}

	throw new Error(`Failed to get profile ${username}`);
}

export async function getGamesByPlayer(
	username: string
): Promise<z.infer<typeof DisplayGameSchemaArray>> {
	const response = await instance({
		url: `/game/player/${username}`,
		method: "get",
	});

	if (response.status === 200) {
		const validate = DisplayGameSchemaArray.safeParse(response.data);

		if (validate.success) return validate.data;
	}

	throw new Error(`Failed to get games for ${username}`);
}

export async function getAllUsers() {
	const response = await instance({
		url: "/player/all",
		method: "get",
	});

	if (response.status === 200)
		return response.data.map((name: string) => {
			return { name: name };
		});

	throw new Error("Failed to get users");
}
