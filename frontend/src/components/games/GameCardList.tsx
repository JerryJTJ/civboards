import { ScrollShadow } from "@heroui/scroll-shadow";
import GamesCard from "./GameCard";
import { DisplayGameSchema } from "@civboards/schemas";
import * as z from "zod";
import { DEFAULT_DISPLAY_GAME } from "@constants/gameDefaults";
import { useDisclosure } from "@heroui/modal";
import { useState } from "react";
import EditGameModal from "@components/forms/EditGameModal";
import DeleteModal from "./DeleteModal";

interface GameCardListProps {
	games: z.infer<typeof DisplayGameSchema>[];
}

export default function GameCardList(props: GameCardListProps) {
	const { games } = props;

	const [currGame, setCurrGame] =
		useState<z.infer<typeof DisplayGameSchema>>(DEFAULT_DISPLAY_GAME);

	const editModal = useDisclosure();
	const deleteModal = useDisclosure();

	return (
		<>
			<ScrollShadow
				className="flex flex-row items-center gap-4 overflow-y-hidden md:gap-10 lg:h-[75vh] w-[80vw] scroll-smooth snap-mandatory h-[65vh] py-8 md:py-10 "
				orientation="horizontal"
				size={20}
			>
				{games.map((game) => (
					<GamesCard
						key={`${game.id}-card`}
						game={game}
						setCurrGame={setCurrGame}
						onOpenDelete={deleteModal.onOpen}
						onOpenEdit={editModal.onOpen}
					/>
				))}
			</ScrollShadow>
			{/* Modals */}
			<EditGameModal key={`${currGame.id}-edit`} disclosure={editModal} game={currGame} />
			<DeleteModal
				key={`${currGame.id}-delete`}
				gameId={currGame.id}
				isOpen={deleteModal.isOpen}
				name={currGame.name}
				onOpenChange={deleteModal.onOpenChange}
			/>
		</>
	);
}
