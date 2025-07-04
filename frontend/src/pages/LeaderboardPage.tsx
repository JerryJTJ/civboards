import LeaderboardTable from "@/components/LeaderboardTable";
import { games } from "@/constants/mockData";
import DefaultLayout from "@/layouts/default";

export default function LeaderboardPage() {
	//Find players & wins
	const players = new Map<string, number>();

	for (const game of games) {
		for (const player of game.players) {
			if (!players.has(player)) players.set(player, 0);
		}

		players.set(game.winner, (players.get(game.winner) ?? 0) + 1);
	}

	const leaderboardData = Array.from(players, ([player, wins]) => ({
		player: player,
		wins: wins,
	}));

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center w-full gap-4 py-4 2xl:py-8 md:max-w-[50vw] xl:max-w-[33vw]">
				<LeaderboardTable leaderboardData={leaderboardData} />
			</section>
		</DefaultLayout>
	);
}
