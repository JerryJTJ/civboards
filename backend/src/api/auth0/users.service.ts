import axios, { AxiosResponse } from "axios";
import getManagementToken from "./getManagementToken.js";
import { NotFoundError } from "../../types/Errors.js";

interface Auth0User {
	nickname: string;
	username: string;
	user_id: string;
	picture: string;
	email_verified: boolean;
	created_at: string;
	last_password_reset: string;
	identities: [
		{
			connection: string;
			user_id: string;
			provider: string;
			isSocial: boolean;
		},
	];
	email: string;
	name: string;
	updated_at: string;
	last_login: string;
	last_ip: string;
	logins_count: number;
}

export async function getUserByUsername(username: string) {
	const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
	if (!AUTH0_DOMAIN) throw new Error("Couldn't get Auth0 Domain");

	const accessToken = await getManagementToken();

	const options = {
		method: "GET",
		url: `https://${AUTH0_DOMAIN}/api/v2/users`,
		params: { q: `username:"${username}"`, search_engine: "v3" },
		headers: { authorization: `Bearer ${accessToken}` },
	};

	try {
		const response: AxiosResponse<Auth0User[]> = await axios.request(options);
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
