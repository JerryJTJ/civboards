import { instance } from "./axiosInstance";

export async function getAllGameWinners(): Promise<
	Array<{ player: string; wins: number }> | undefined
> {
	const response = await instance({
		url: "/game/winners/players",
		method: "get",
	});

	if (response.status === 200) return response.data;
}

export async function getAllGameWinnerLeaderIds(): Promise<
	Array<{ leaderId: number; leaderName: string; wins: number }> | undefined
> {
	const response = await instance({
		url: "/game/winners/leaders",
		method: "get",
	});

	if (response.status === 200) return response.data;
}

export async function getAllGameWinnerCivilizationIds(): Promise<
	| Array<{ civilizationId: number; civilizationName: string; wins: number }>
	| undefined
> {
	const response = await instance({
		url: "/game/winners/civilizations",
		method: "get",
	});

	if (response.status === 200) return response.data;
}

export async function getAllGameVictoryIds(): Promise<
	Array<{ victoryId: number; victoryType: string; wins: number }> | undefined
> {
	const response = await instance({
		url: "/game/winners/victories",
		method: "get",
	});

	if (response.status === 200) return response.data;
}
