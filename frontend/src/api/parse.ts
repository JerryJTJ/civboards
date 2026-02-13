import * as z from "zod";
import { GameForm } from "@interfaces/game.interface";
import { ParseSaveSchema } from "@civboards/schemas";
import { instance } from "./axiosInstance";
import useAccessToken from "./useAccessToken";

type ParseResponse =
	| { success: true; data: Partial<GameForm> }
	| { success: false };

export function useParseAPI() {
	const getToken = useAccessToken();

	async function parseSaveFile(save: File): Promise<ParseResponse> {
		try {
			const bodyData = new FormData();
			bodyData.append("savefile", save);

			// Get token
			console.log("getting token");
			const token = await getToken();
			console.log("got token", token);

			// Call API
			console.log("parsing");
			const response = await instance({
				url: "/parse/upload",
				method: "post",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: bodyData,
			});


			console.log("parsed");
			if (response.status === 200) {
				const parsed = response.data as z.infer<typeof ParseSaveSchema>;

				return {
					success: true,
					data: {
						...parsed,
						name: save.name.replace(".Civ6Save", ""),
						date: save.lastModified,
						expansions: new Set(parsed.expansions),
						players: parsed.players.map((player) => ({
							...player,
							id: crypto.randomUUID(),
						})),
					},
				};
			}
		} catch (error: any) {
			console.error("Failed to parse save file:", error);
		}

		return { success: false };
	}

	return { parseSaveFile };
}
