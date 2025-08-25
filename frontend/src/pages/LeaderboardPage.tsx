import LeaderboardTable from "@/components/LeaderboardTable";
import { Spinner } from "@heroui/spinner";
import DefaultLayout from "@/layouts/default";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
	getAllGameVictoryIds,
	getAllGameWinnerCivilizationIds,
	getAllGameWinnerLeaderIds,
	getAllGameWinners,
} from "@/api/leaderboards";
import { ButtonGroup, Button } from "@heroui/button";

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
					<Spinner></Spinner>
				) : (
					<LeaderboardTable
						view={tab}
						leaderboardData={
							sanitizeForLeaderboard(tab, players.data!)!
						}
					/>
				);
			case "leader":
				return leaders.isPending ? (
					<Spinner></Spinner>
				) : (
					<LeaderboardTable
						view={tab}
						leaderboardData={
							sanitizeForLeaderboard(tab, leaders.data!)!
						}
					/>
				);
			case "civilization":
				return civilizations.isPending ? (
					<Spinner></Spinner>
				) : (
					<LeaderboardTable
						view={tab}
						leaderboardData={
							sanitizeForLeaderboard(tab, civilizations.data!)!
						}
					/>
				);
			case "victory":
				return victories.isPending ? (
					<Spinner></Spinner>
				) : (
					<LeaderboardTable
						view={tab}
						leaderboardData={
							sanitizeForLeaderboard(tab, victories.data!)!
						}
					/>
				);
		}
	}, [
		tab,
		players.isPending,
		leaders.isPending,
		civilizations.isPending,
		victories.isPending,
	]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center w-full gap-10 py-4 2xl:py-8 md:w-[40vw]">
				<ButtonGroup className="justify-self-start ">
					<Button
						className="border border-white/20"
						variant="shadow"
						onPress={() => {
							setTab("player");
						}}
						color={tab === "player" ? "primary" : "default"}
					>
						Players
					</Button>
					<Button
						className="border border-white/20"
						variant="shadow"
						onPress={() => {
							setTab("leader");
						}}
						color={tab === "leader" ? "primary" : "default"}
					>
						Leaders
					</Button>
					<Button
						className="border border-white/20"
						variant="shadow"
						onPress={() => {
							setTab("civilization");
						}}
						color={tab === "civilization" ? "primary" : "default"}
					>
						Civilizations
					</Button>
					<Button
						className="border border-white/20"
						variant="shadow"
						onPress={() => {
							setTab("victory");
						}}
						color={tab === "victory" ? "primary" : "default"}
					>
						Victories
					</Button>
				</ButtonGroup>
				{table}
			</section>
		</DefaultLayout>
	);
}
