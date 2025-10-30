import React from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useQuery } from "@tanstack/react-query";

import DefaultLayout from "@/layouts/default";
import GamesCard from "@/components/games/GamesCard";
import GamesTable from "@/components/games/GamesTable";
import AddGameModal from "@/components/forms/AddGameModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGamesAPI } from "@/api/games";

type TabView = "cards" | "table";

export default function GamesPage() {
	const [currTab, setCurrTab] = React.useState<TabView>("cards");

	const { getAllGames } = useGamesAPI();
	const { data, isPending, refetch } = useQuery({
		queryKey: ["games"],
		queryFn: getAllGames,
	});

	return (
		<DefaultLayout>
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-2 pb-4 lg:pb-0">
					<ButtonGroup className="justify-self-start ">
						<Button
							className="border border-white/20"
							color={currTab === "cards" ? "primary" : "default"}
							variant="shadow"
							onPress={() => {
								setCurrTab("cards");
							}}
						>
							Cards
						</Button>
						<Button
							className="border border-white/20"
							color={currTab === "table" ? "primary" : "default"}
							variant="shadow"
							onPress={() => {
								setCurrTab("table");
							}}
						>
							Table
						</Button>
					</ButtonGroup>
					<AddGameModal />
				</div>
				{/* Janky formatting to keep buttons positioned while loading */}
				{isPending && <LoadingSpinner height={20} />}
				<ScrollShadow
					orientation="horizontal"
					size={20}
					className="flex flex-row self-center items-center gap-4 h-[65vh] py-8 md:py-10 scroll-smooth snap-mandatory md:gap-10 lg:h-[80vh] w-[70vw] overflow-y-hidden "
				>
					{!isPending && (
						<>
							{currTab === "cards" ? (
								<>
									{data?.map((game) => (
										<GamesCard
											key={`${game.id}-card`}
											game={game}
											refetch={refetch}
										/>
									))}
								</>
							) : null}
							{currTab === "table" ? (
								<GamesTable games={data!} refetch={refetch} />
							) : null}
						</>
					)}
				</ScrollShadow>
			</div>
		</DefaultLayout>
	);
}
