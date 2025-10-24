import { instance } from "./axiosInstance";
import useAccessToken from "./useAccessToken";

export function useParseAPI() {
	const getToken = useAccessToken();

	async function parseSaveFile(
		save: File
	): Promise<{ success: boolean; data?: any; name?: string }> {
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
			return {
				success: true,
				data: {
					...response.data,
					name: save.name.replace(".Civ6Save", ""),
					date: save.lastModified,
				},
			};
		}

		return {
			success: false,
		};
	}

	return { parseSaveFile };
}
