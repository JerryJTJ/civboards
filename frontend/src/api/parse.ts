import { instance } from "./axiosInstance";

export async function parseSaveFile(
	save: File
): Promise<{ success: boolean; data?: any; name?: string }> {
	const bodyData = new FormData();
	bodyData.append("savefile", save);
	try {
		const response = await instance({
			url: "/parse/upload",
			method: "post",
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
	} catch (error) {
		return {
			success: false,
		};
	}
	return {
		success: false,
	};
}
