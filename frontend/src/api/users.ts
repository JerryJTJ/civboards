import { ProfileSchema } from "@civboards/schemas";
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
