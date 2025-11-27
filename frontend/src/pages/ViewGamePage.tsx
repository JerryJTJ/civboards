import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Civ } from "@interfaces/game.interface";
import { Skeleton } from "@heroui/skeleton";
import { useGamesAPI } from "@api/games";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CivField from "@components/forms/CivField";
import DefaultLayout from "@layouts/default";
import GameOptionsForm from "@components/forms/GameOptionsForm";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function ViewGamePage() {
	const { gameId } = useParams();
	const { getGameByGameId } = useGamesAPI();

	const { data, isPending, error } = useQuery({
		queryKey: ["game", gameId],
		queryFn: async () => {
			if (!gameId) throw new Error();

			return await getGameByGameId(gameId);
		},
	});

	const civFields = useMemo(() => {
		const display = data
			? data.players.map((civ: Civ) => (
					<CivField key={civ.id} civ={civ} enabled={false} />
				))
			: undefined;

		return (
			<ScrollShadow
				className="overflow-x-hidden overflow-y-auto max-h-[60vh] pt-2"
				size={10}
			>
				<div className="flex flex-col justify-start gap-2 mr-2">{display}</div>
			</ScrollShadow>
		);
	}, [data]);

	const gameOptionFields = useMemo(() => {
		return data ? (
			<ScrollShadow className="lg:max-h-[60vh] overflow-auto pt-2" size={20}>
				<div className="mr-3.5">
					<GameOptionsForm
						enabled={false}
						form={{
							...data,
							winnerPlayer: data.winnerPlayer ?? "",
							date: Date.parse(data.date),
							victoryId: data.victoryId ?? undefined,
							expansions: new Set(data.expansions),
							gamemodes: new Set(data.gamemodes),
						}}
					/>
				</div>
			</ScrollShadow>
		) : undefined;
	}, [data]);

	return (
		<DefaultLayout>
			{!error ? (
				<Card
					isBlurred
					className="flex items-center justify-center m-5 border-none bg-background/60 dark:bg-default-100/50 "
					shadow="md"
				>
					<CardHeader />
					<CardBody>
						<div className="grid grid-cols-6 gap-4 px-10 py-2 lg:max-h-[70vh]">
							<div className="col-span-4">
								<Skeleton className="rounded-xl" isLoaded={!isPending}>
									{" "}
									<p className="self-center pb-4 font-bold">Players</p>
									{civFields}
								</Skeleton>
							</div>

							<div className="col-span-2">
								<Skeleton className="rounded-xl" isLoaded={!isPending}>
									<p className="self-center pb-4 overflow-scroll font-bold">
										Game Options
									</p>
									{gameOptionFields}
								</Skeleton>
							</div>
						</div>
					</CardBody>
					<CardFooter />
				</Card>
			) : (
				<Card
					isBlurred
					className="flex items-center justify-center border-none bg-background/60 dark:bg-default-100/50"
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
