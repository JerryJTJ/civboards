import axios from "axios";
import getAccessToken from "./getAccessToken.js";
import { NotFoundError, ValidationError } from "../../types/Errors.js";

export async function getUserByUsername(username: string) {
	const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
	if (!AUTH0_DOMAIN) throw new Error("Couldn't get Auth0 Domain");

	const accessToken = await getAccessToken();

	const options = {
		method: "GET",
		url: `${AUTH0_DOMAIN}api/v2/users`,
		params: { q: `username:"${username}"`, search_engine: "v3" },
		headers: { authorization: `Bearer ${accessToken}` },
	};

	try {
		const response = await axios.request(options);
		if (response.data.length === 0)
			throw new NotFoundError(`Username ${username} not found`);
		return response.data;
	} catch (error) {
		if (error instanceof NotFoundError) throw error;
		throw new Error(`Failed to get user ${username}`);
	}
}

export async function getProfilePicByUsername(username: string) {
	const user = await getUserByUsername(username);
	return { username: user[0].username, picture: user[0].picture };
}
