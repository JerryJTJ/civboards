import DefaultLayout from "@/layouts/default";
import GamesCard from "@/components/GamesCard";
import React from "react";
import GamesTable from "@/components/GamesTable";
import { Button, ButtonGroup } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import AddGameModal from "@/components/forms/AddGameModal";
import { useQuery } from "@tanstack/react-query";
import { getAllGames } from "@/api/games";

type TabView = "cards" | "table";

export default function GamesPage() {
	const [currTab, setCurrTab] = React.useState<TabView>("cards");

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
							className="border-white/20 border-1"
							variant="shadow"
							onPress={() => {
								setCurrTab("cards");
							}}
							color={currTab === "cards" ? "primary" : "default"}
						>
							Cards
						</Button>
						<Button
							className=" border-white/20 border-1"
							variant="shadow"
							onPress={() => {
								setCurrTab("table");
							}}
							color={currTab === "table" ? "primary" : "default"}
						>
							Table
						</Button>
					</ButtonGroup>
					<AddGameModal refetch={refetch} />
				</div>
				{/* Janky way to keep formatting nice */}
				{isPending && (
					<div className="self-center py-10">
						<Spinner />
					</div>
				)}
				<div className="flex flex-row self-center items-center gap-4 h-[65vh] py-8 h-9/10 md:py-10 scroll-smooth snap-mandatory md:gap-10 lg:h-[80vh] w-[70vw] overflow-y-hidden">
					{!isPending && (
						<>
							{" "}
							{currTab === "cards" ? (
								<>
									{" "}
									{data?.map((game) => (
										<GamesCard
											key={`${game.id}-card`}
											game={game}
										/>
									))}
								</>
							) : null}
							{currTab === "table" ? (
								<>
									<GamesTable
										games={data!}
										refetch={refetch}
									/>
								</>
							) : null}
						</>
					)}
				</div>
			</div>
		</DefaultLayout>
	);
}
