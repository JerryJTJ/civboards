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
		const bodyData = new FormData();

		bodyData.append("savefile", save);
		const token = await getToken();

		const response = await instance({
			url: "/parse/upload",
			method: "post",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: bodyData,
		});

		if (response.status === 200) {
			const parsed = response.data as z.infer<typeof ParseSaveSchema>;

			return {
				success: true,
				data: {
					...parsed,
					name: save.name.replace(".Civ6Save", ""),
					date: save.lastModified,
					expansions: new Set(parsed.expansions),
					players: parsed.players.map((player) => {
						return { ...player, id: crypto.randomUUID() };
					}),
				},
			};
		}

		return {
			success: false,
		};
	}

	return { parseSaveFile };
}
