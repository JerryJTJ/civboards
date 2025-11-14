import { useAuth0 } from "@auth0/auth0-react";

export default function useAccessToken() {
	const { getAccessTokenSilently } = useAuth0();

	const getAccessToken = async () => {
		return await getAccessTokenSilently({
			authorizationParams: {
				audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE as string,
				scope: "games:authorized",
			},
		});
	};

	const getToken = async (): Promise<string> => {
		try {
			return await getAccessToken();
		} catch {
			// Only verifiable first-party applications may skip consent
			// When in dev, comment the error and run the code below to get consent

			throw new Error("Failed to get access token");
			// await loginWithPopup({
			// 	authorizationParams: {
			// 		audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE as string,
			// 		scope: "games:authorized",
			// 	},
			// });
			// return await getAccessToken();
		}
	};

	return getToken;
}
