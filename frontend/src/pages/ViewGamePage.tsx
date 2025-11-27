import { Card, CardBody } from "@heroui/card";
import { useAuth0 } from "@auth0/auth0-react";
import { useGamesAPI } from "@api/games";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DefaultLayout from "@layouts/default";
import { useDisclosure } from "@heroui/modal";
import ViewGameCard from "@components/games/ViewGameCard";
import { useMemo } from "react";
import EditGameModal from "@components/forms/EditGameModal";
import { Skeleton } from "@heroui/skeleton";
import LoadingSpinner from "@components/LoadingSpinner";

export default function ViewGamePage() {
	const { gameId } = useParams();
	const { getGameByGameId } = useGamesAPI();

	const { user } = useAuth0();
	const username = useMemo(() => {
		return user ? (user.username as string) : "";
	}, [user]);

	const { data, isPending, error } = useQuery({
		queryKey: ["game", gameId],
		queryFn: async () => {
			if (!gameId) throw new Error();

			return await getGameByGameId(gameId);
		},
	});

	const disclosure = useDisclosure();

	return (
		<DefaultLayout>
			{!error ? (
				isPending ? (
					<LoadingSpinner height={25} />
				) : (
					data && (
						<>
							{" "}
							<ViewGameCard
								game={data}
								isPending={isPending}
								username={username}
								onOpenEdit={disclosure.onOpen}
							/>
							{username === data.createdBy && (
								<EditGameModal disclosure={disclosure} game={data} />
							)}
						</>
					)
				)
			) : (
				<Card
					isBlurred
					className="flex items-center p-5 border-none justify-self-center bg-background/60 dark:bg-default-100/50"
					shadow="sm"
				>
					<CardBody>
						<p>Game not found!</p>
					</CardBody>
				</Card>
			)}
		</DefaultLayout>
	);
}
