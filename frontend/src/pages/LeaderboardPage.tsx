import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ButtonGroup, Button } from "@heroui/button";

import {
	getAllGameVictoryIds,
	getAllGameWinnerCivilizationIds,
	getAllGameWinnerLeaderIds,
	getAllGameWinners,
} from "@/api/leaderboards";
import DefaultLayout from "@/layouts/default";
import LeaderboardTable from "@/components/LeaderboardTable";
import LoadingSpinner from "@/components/LoadingSpinner";

function sanitizeForLeaderboard(type: LeaderboardView, data: Array<any>) {
	switch (type) {
		case "player":
			return data.map((player) => {
				return { label: player.player, wins: player.wins };
			});
		case "leader":
			return data.map((leader) => {
				return { label: leader.leaderName, wins: leader.wins };
			});
		case "civilization":
			return data.map((civilization) => {
				return {
					label: civilization.civilizationName,
					wins: civilization.wins,
				};
			});
		case "victory":
			return data.map((victory) => {
				return {
					label: victory.victoryType,
					wins: victory.wins,
				};
			});
	}
}

export type LeaderboardView = "player" | "leader" | "civilization" | "victory";

export default function LeaderboardPage() {
	const [tab, setTab] = useState<LeaderboardView>("victory");

	const loadingSpinner = <LoadingSpinner height={20} />;

	//API
	const [players, leaders, civilizations, victories] = useQueries({
		queries: [
			{
				queryKey: ["winner_players"],
				queryFn: getAllGameWinners,
				retry: 3,
			},
			{
				queryKey: ["winner_leaders"],
				queryFn: getAllGameWinnerLeaderIds,
				retry: 3,
			},
			{
				queryKey: ["winner_civilizations"],
				queryFn: getAllGameWinnerCivilizationIds,
				retry: 3,
			},
			{
				queryKey: ["winner_victories"],
				queryFn: getAllGameVictoryIds,
				retry: 3,
			},
		],
	});

	const table = useMemo(() => {
		switch (tab) {
			case "player":
				return players.isPending ? (
					loadingSpinner
				) : (
					<LeaderboardTable
						leaderboardData={
							sanitizeForLeaderboard(tab, players.data!)!
						}
						view={tab}
					/>
				);
			case "leader":
				return leaders.isPending ? (
					loadingSpinner
				) : (
					<LeaderboardTable
						leaderboardData={
							sanitizeForLeaderboard(tab, leaders.data!)!
						}
						view={tab}
					/>
				);
			case "civilization":
				return civilizations.isPending ? (
					loadingSpinner
				) : (
					<LeaderboardTable
						leaderboardData={
							sanitizeForLeaderboard(tab, civilizations.data!)!
						}
						view={tab}
					/>
				);
			case "victory":
				return victories.isPending ? (
					loadingSpinner
				) : (
					<LeaderboardTable
						leaderboardData={
							sanitizeForLeaderboard(tab, victories.data!)!
						}
						view={tab}
					/>
				);
		}
	}, [
		tab,
		players.isPending,
		players.data,
		leaders.isPending,
		leaders.data,
		civilizations.isPending,
		civilizations.data,
		victories.isPending,
		victories.data,
	]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center w-full gap-10 py-4 2xl:py-8 md:w-[40vw]">
				<ButtonGroup className="justify-self-start ">
					<Button
						className="border border-white/20"
						color={tab === "player" ? "primary" : "default"}
						variant="shadow"
						onPress={() => {
							setTab("player");
						}}
					>
						Players
					</Button>
					<Button
						className="border border-white/20"
						color={tab === "leader" ? "primary" : "default"}
						variant="shadow"
						onPress={() => {
							setTab("leader");
						}}
					>
						Leaders
					</Button>
					<Button
						className="border border-white/20"
						color={tab === "civilization" ? "primary" : "default"}
						variant="shadow"
						onPress={() => {
							setTab("civilization");
						}}
					>
						Civilizations
					</Button>
					<Button
						className="border border-white/20"
						color={tab === "victory" ? "primary" : "default"}
						variant="shadow"
						onPress={() => {
							setTab("victory");
						}}
					>
						Victories
					</Button>
				</ButtonGroup>
				{table}
			</section>
		</DefaultLayout>
	);
}
