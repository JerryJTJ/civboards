import { Button, ButtonGroup } from "@heroui/button";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import {
	CivilizationsData,
	LeadersData,
	PlayersData,
	VictoriesData,
} from "@customTypes/leaderboard.types";
import {
	getAllGameVictoryIds,
	getAllGameWinnerCivilizationIds,
	getAllGameWinnerLeaderIds,
	getAllGameWinners,
} from "@api/leaderboards";
import DefaultLayout from "@layouts/default";
import LeaderboardTable from "@components/LeaderboardTable";
import LoadingSpinner from "@components/LoadingSpinner";
import getViewportSize from "@components/utils/getViewportSize";
import useWindowDimensions from "@hooks/useWindowDimensions";

type LeaderbordStats =
	| { type: "player"; data: PlayersData[] }
	| { type: "leader"; data: LeadersData[] }
	| { type: "civilization"; data: CivilizationsData[] }
	| { type: "victory"; data: VictoriesData[] };

function sanitizeForLeaderboard(stats: LeaderbordStats) {
	const { type, data } = stats;

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
	const [tab, setTab] = useState<LeaderboardView>("player");
	const { width } = useWindowDimensions();

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
		const loadingSpinner = <LoadingSpinner height={20} />;

		switch (tab) {
			case "player":
				return players.isPending ? (
					loadingSpinner
				) : (
					<LeaderboardTable
						leaderboardData={
							players.data
								? sanitizeForLeaderboard({
										type: "player",
										data: players.data,
									})
								: []
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
							leaders.data
								? sanitizeForLeaderboard({
										type: "leader",
										data: leaders.data,
									})
								: []
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
							civilizations.data
								? sanitizeForLeaderboard({
										type: "civilization",
										data: civilizations.data,
									})
								: []
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
							victories.data
								? sanitizeForLeaderboard({
										type: "victory",
										data: victories.data,
									})
								: []
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
			<section className="flex flex-col items-center justify-center w-full gap-10 py-4 2xl:py-8 max-w-[85vw] md:w-[40vw]">
				<ButtonGroup
					className="justify-self-start "
					size={getViewportSize(width) === "xs" ? "sm" : "md"}
				>
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
