import { useAuth0 } from "@auth0/auth0-react";

export default function useAccessToken() {
	const { getAccessTokenSilently, loginWithPopup } = useAuth0();

	const getToken = async (): Promise<string> => {
		try {
			return await getAccessTokenSilently({
				authorizationParams: {
					audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE,
					scope: "games:authorized",
				},
			});
		} catch (_e) {
			loginWithPopup({
				authorizationParams: {
					audience: import.meta.env.VITE_AUTHO_GAMES_AUDIENCE,
					scope: "games:authorized",
				},
			});
			return "";
		}
	};

	return getToken;
}
