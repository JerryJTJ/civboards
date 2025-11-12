import { AxiosResponse } from "axios";
import { instance } from "./axiosInstance";

export async function getProfilePic(username: string): Promise<string> {
	try {
		const response: AxiosResponse<{ username: string; picture: string }> =
			await instance({
				url: `/auth0/user/pic/${username}`,
				method: "get",
			});

		const regex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/;
		if (regex.exec(response.data.picture)) return response.data.picture;
		throw new Error();
	} catch {
		return "";
	}
}
