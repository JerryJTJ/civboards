import { getAllGameWinners } from "@/api/games";
import LeaderboardTable from "@/components/LeaderboardTable";
import { Spinner } from "@heroui/spinner";
import DefaultLayout from "@/layouts/default";
import { useQuery } from "@tanstack/react-query";

export default function LeaderboardPage() {
	//Find players & wins
	const { data, isPending } = useQuery({
		queryKey: ["winners_players"],
		queryFn: getAllGameWinners,
	});

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center w-full gap-4 py-4 2xl:py-8 md:w-[40vw]">
				{isPending ? (
					<Spinner />
				) : (
					<LeaderboardTable leaderboardData={data!} />
				)}
			</section>
		</DefaultLayout>
	);
}
