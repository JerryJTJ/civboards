import * as z from "zod";
import { Card, CardFooter } from "@heroui/card";
import { DisplayGameSchema, DisplayGameSchemaArray } from "@civboards/schemas";
import { Dropdown, DropdownTrigger } from "@heroui/dropdown";
import { Image } from "@heroui/image";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useDisclosure } from "@heroui/modal";

import DeleteModal from "./DeleteModal";
import EditGameModal from "../forms/EditGameModal";
import GamesOptionDropdown from "./GamesOptionDropdown";
import ViewGameModal from "../forms/ViewGameModal";

import { capitalize } from "@/utils/capitalize";

import menu from "../../../public/menu_background.webp";

interface GameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
	refetch: (
		options?: RefetchOptions
	) => Promise<
		QueryObserverResult<z.infer<typeof DisplayGameSchemaArray> | undefined>
	>;
}

export default function GamesCard(props: GameCardProps) {
	const { game, refetch } = props;

	const viewModal = useDisclosure();
	const deleteModal = useDisclosure();
	const editModal = useDisclosure();

	// UI
	const humans = new Array<string>();

	game.players.forEach((player) => {
		if (player.isHuman) humans.push(capitalize(player.name));
	});

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Card
						isFooterBlurred
						isPressable
						className="flex items-center rounded-large justify-center object-none min-w-[150px] md:min-w-[200px] h-[60vh] md:h-[65vh] lg:h-[70vh] col-span-12 sm:col-span-7 2xl:min-w-[10vw] border-white/20 border"
						shadow="sm"
					>
						<Image
							isZoomed
							removeWrapper
							alt={game.name}
							className="z-0 object-cover w-full h-full"
							src={menu}
						/>
						<CardFooter className="flex-col backdrop-blur-md text-foreground/90 justify-between before:bg-white/10 border-white/20 border overflow-hidden absolute before:rounded-xl rounded-large w-[calc(100%-8px)] shadow-small ml-1 z-10">
							<b>{game.name}</b>
							<em>{new Date(game.date).toLocaleDateString()}</em>
							<em>{game.map}</em>
							{humans.join(", ")}
						</CardFooter>
					</Card>
				</DropdownTrigger>
				<GamesOptionDropdown
					game={game}
					onOpenDelete={deleteModal.onOpen}
					onOpenEdit={editModal.onOpen}
					onOpenView={viewModal.onOpen}
				/>
			</Dropdown>
			{viewModal.isOpen && <ViewGameModal disclosure={viewModal} game={game} />}
			{editModal.isOpen && <EditGameModal disclosure={editModal} game={game} />}
			{deleteModal.isOpen && (
				<DeleteModal
					body={
						<p>
							Are you sure you want to delete <b>{game.name}</b>?
						</p>
					}
					gameId={game.id}
					isOpen={deleteModal.isOpen}
					refetch={refetch}
					onOpenChange={deleteModal.onOpenChange}
				/>
			)}
		</>
	);
}
