import {
	CivilizationsData,
	LeadersData,
	PlayersData,
	VictoriesData,
} from "@/types/leaderboard.types";
import { instance } from "./axiosInstance";

export async function getAllGameWinners(): Promise<PlayersData[] | undefined> {
	const response = await instance({
		url: "/game/winners/players",
		method: "get",
	});

	if (response.status === 200) return response.data as PlayersData[];
}

export async function getAllGameWinnerLeaderIds(): Promise<
	LeadersData[] | undefined
> {
	const response = await instance({
		url: "/game/winners/leaders",
		method: "get",
	});

	if (response.status === 200) return response.data as LeadersData[];
}

export async function getAllGameWinnerCivilizationIds(): Promise<
	CivilizationsData[] | undefined
> {
	const response = await instance({
		url: "/game/winners/civilizations",
		method: "get",
	});

	if (response.status === 200) return response.data as CivilizationsData[];
}

export async function getAllGameVictoryIds(): Promise<
	VictoriesData[] | undefined
> {
	const response = await instance({
		url: "/game/winners/victories",
		method: "get",
	});

	if (response.status === 200) return response.data as VictoriesData[];
}
