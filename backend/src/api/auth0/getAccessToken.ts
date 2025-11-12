import axios from "axios";

export default async function getAccessToken(): Promise<string> {
	const AUTH0_MANAGEMENT_CLIENT_ID = process.env.AUTH0_MANAGEMENT_CLIENT_ID;
	const AUTH0_MANAGEMENT_CLIENT_SECRET =
		process.env.AUTH0_MANAGEMENT_CLIENT_SECRET;
	const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

	if (
		!AUTH0_MANAGEMENT_CLIENT_ID ||
		!AUTH0_MANAGEMENT_CLIENT_SECRET ||
		!AUTH0_DOMAIN
	)
		throw new Error("Couldn't get Auth0 Management Secrets");

	const options = {
		method: "POST",
		url: `${AUTH0_DOMAIN}oauth/token`,
		headers: { "content-type": "application/x-www-form-urlencoded" },
		data: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: AUTH0_MANAGEMENT_CLIENT_ID,
			client_secret: AUTH0_MANAGEMENT_CLIENT_SECRET,
			audience: `${AUTH0_DOMAIN}api/v2/`,
		}),
	};

	try {
		const response = await axios.request(options);
		return response.data.access_token as string;
	} catch (error) {
		throw new Error("Failed to get Auth0 access token");
	}
}
