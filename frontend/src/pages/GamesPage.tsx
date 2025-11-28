import { Button, ButtonGroup } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useGamesAPI } from "@api/games";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddGameModal from "@components/forms/AddGameModal";
import DefaultLayout from "@layouts/default";
import GamesTable from "@components/games/GamesTable";
import getViewportSize from "@components/utils/getViewportSize";
import useWindowDimensions from "@hooks/useWindowDimensions";
import GameCardList from "@components/games/GameCardList";

type TabView = "cards" | "table";

export default function GamesPage() {
	const [currTab, setCurrTab] = useState<TabView>("cards");

	const { width } = useWindowDimensions();

	const { getAllGames } = useGamesAPI();
	const { data, isPending, error } = useQuery({
		queryKey: ["games"],
		queryFn: getAllGames,
	});

	return (
		<DefaultLayout>
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-2 pb-4">
					{!error && (
						<ButtonGroup
							className="justify-self-start "
							size={getViewportSize(width) === "xs" ? "sm" : "md"}
						>
							<Button
								className="border border-foreground/20"
								color={currTab === "cards" ? "primary" : "default"}
								variant="shadow"
								onPress={() => {
									setCurrTab("cards");
								}}
							>
								Cards
							</Button>
							<Button
								className="border border-foreground/20"
								color={currTab === "table" ? "primary" : "default"}
								variant="shadow"
								onPress={() => {
									setCurrTab("table");
								}}
							>
								Table
							</Button>
						</ButtonGroup>
					)}
					{getViewportSize(width) === "xs" || error || isPending ? null : (
						<AddGameModal />
					)}
				</div>
				{/* Janky formatting to keep buttons positioned while loading
				{isPending && <LoadingSpinner height={20} />} */}

				<Skeleton className="rounded-4xl" isLoaded={!isPending}>
					{currTab === "cards" ? (
						error ? (
							<Card isBlurred>
								<CardHeader className="justify-center px-20 pt-5">
									<b className="pt-2 text-base">Error</b>
								</CardHeader>
								<CardBody className="justify-center px-10 py-5 text-center">
									No games found!
								</CardBody>
							</Card>
						) : (
							data && <GameCardList games={data} />
						)
					) : null}
					{currTab === "table" ? (
						<div className="flex flex-col items-center pt-4 w-[80vw]  scale-85 sm:scale-100">
							<GamesTable games={data ?? []} />
						</div>
					) : null}
				</Skeleton>
			</div>
		</DefaultLayout>
	);
}
