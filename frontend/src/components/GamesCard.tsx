import { DisplayGameSchema, DisplayGameSchemaArray } from "@civboards/schemas";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/modal";
import z from "zod";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

import GameModal from "./GameModal";
import DeleteModal from "./DeleteModal";

interface GameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
	refetch: (
		options?: RefetchOptions | undefined
	) => Promise<
		QueryObserverResult<
			z.infer<typeof DisplayGameSchemaArray> | undefined,
			Error
		>
	>;
}

export default function GamesCard(props: GameCardProps) {
	const { game, refetch } = props;

	const viewModal = useDisclosure();
	const deleteModal = useDisclosure();

	// UI
	let humans = new Array<string>();

	game.players.forEach((player) => {
		if (player.isHuman) humans.push(player.name);
	});

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Card
						isFooterBlurred
						isPressable
						className="flex items-center justify-center object-none min-w-[150px] md:min-w-[200px] sm:h-[70vh] col-span-12 sm:col-span-7 2xl:min-w-[10vw] border-white/20 border"
						shadow="sm"
					>
						<Image
							isZoomed
							removeWrapper
							alt={game.name}
							className="z-0 object-cover w-full h-full"
							src="https://i.imgur.com/ReQSfcb.png"
						/>
						<CardFooter className="flex-col backdrop-blur-md text-foreground/90 justify-between before:bg-white/10 border-white/20 border overflow-hidden absolute before:rounded-xl rounded-large w-[calc(100%-8px)] shadow-small ml-1 z-10">
							<b>{game.name}</b>
							<em>{new Date(game.date).toLocaleDateString()}</em>
							<em>{game.map}</em>
							{humans.join(", ")}
						</CardFooter>
					</Card>
				</DropdownTrigger>
				<DropdownMenu aria-label="Game Actions" variant="flat">
					<DropdownItem key="view" onPress={viewModal.onOpen}>
						View
					</DropdownItem>
					<DropdownItem key="edit">Edit</DropdownItem>
					<DropdownItem
						key="delete"
						color="danger"
						onPress={deleteModal.onOpen}
					>
						Delete
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			{viewModal.isOpen && (
				<GameModal
					game={game}
					isOpen={viewModal.isOpen}
					mode="view"
					onOpenChange={viewModal.onOpenChange}
				/>
			)}
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
