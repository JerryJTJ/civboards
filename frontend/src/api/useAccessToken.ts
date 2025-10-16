import { useAuth0 } from "@auth0/auth0-react";

export default function useAccessToken() {
	const { loginWithPopup, getAccessTokenSilently } = useAuth0();

	const getAccessToken = async () => {
		return await getAccessTokenSilently({
			authorizationParams: {
				audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE,
				scope: "games:authorized",
			},
		});
	};

	const getToken = async (): Promise<string> => {
		try {
			return await getAccessToken();
		} catch (_e) {
			await loginWithPopup({
				authorizationParams: {
					audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE,
					scope: "games:authorized",
				},
			});

			return await getAccessToken();
		}
	};

	return getToken;
}
