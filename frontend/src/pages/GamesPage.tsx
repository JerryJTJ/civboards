import DefaultLayout from "@/layouts/default";
import GamesCard from "@/components/GamesCard";
import React from "react";
import GamesTable from "@/components/GamesTable";
import { Button, ButtonGroup } from "@heroui/button";
import AddGameModal from "@/components/AddGameModal";
import { games } from "@/constants/mockData";

enum TabView {
	Cards,
	Table,
}

export default function GamesPage() {
	const [currTab, setCurrTab] = React.useState<TabView>(TabView.Cards);

	return (
		<DefaultLayout>
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-2 pb-4 lg:pb-0">
					<ButtonGroup className="justify-self-start ">
						<Button
							className="border-white/20 border-1"
							variant="shadow"
							onPress={() => {
								setCurrTab(TabView.Cards);
							}}
							color={
								currTab === TabView.Cards
									? "primary"
									: "default"
							}
						>
							Cards
						</Button>
						<Button
							className=" border-white/20 border-1"
							variant="shadow"
							onPress={() => {
								setCurrTab(TabView.Table);
							}}
							color={
								currTab === TabView.Table
									? "primary"
									: "default"
							}
						>
							Table
						</Button>
					</ButtonGroup>
					<AddGameModal />
				</div>

				<div className="flex flex-row self-center items-center gap-4 h-[65vh] py-8 h-9/10 md:py-10 scroll-smooth snap-mandatory md:gap-10 lg:h-[80vh] w-[70vw] overflow-y-hidden">
					{currTab === TabView.Cards ? (
						<>
							{" "}
							{games.map((game) => (
								<GamesCard
									key={`${game.uuid}-card`}
									game={game}
								/>
							))}
						</>
					) : null}
					{currTab === TabView.Table ? (
						<>
							{" "}
							<GamesTable games={games} />
						</>
					) : null}
				</div>
			</div>
		</DefaultLayout>
	);
}
