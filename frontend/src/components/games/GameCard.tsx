import * as z from "zod";
import { Card, CardFooter } from "@heroui/card";
import { DisplayGameSchema } from "@civboards/schemas";
import { Dropdown, DropdownTrigger } from "@heroui/dropdown";
import { Image } from "@heroui/image";

import GamesOptionDropdown from "./GamesOptionDropdown";

import { capitalize } from "@utils/capitalize";

import menu from "/menu_background.webp"; // eslint-disable-line import-x/no-unresolved

interface GameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
	setCurrGame: React.Dispatch<
		React.SetStateAction<z.infer<typeof DisplayGameSchema>>
	>;
	onOpenDelete: () => void;
	onOpenEdit: () => void;
}

export default function GamesCard(props: GameCardProps) {
	const { game, setCurrGame, onOpenDelete, onOpenEdit } = props;

	// UI
	const humans = new Array<string>();

	game.players.forEach((player) => {
		if (player.isHuman) humans.push(capitalize(player.name));
	});

	return (
		<>
			<Dropdown
				classNames={{
					base: "border-fg rounded-2xl",
				}}
			>
				<DropdownTrigger>
					<Card
						isFooterBlurred
						isPressable
						className="flex items-center rounded-large justify-center object-none min-w-[150px] md:min-w-[200px] h-[60vh] md:h-[65vh] lg:h-[70vh] col-span-12 sm:col-span-7 2xl:min-w-[10vw] border-foreground/20 border"
						shadow="sm"
					>
						<Image
							isZoomed
							removeWrapper
							alt={game.name}
							className="z-0 object-cover w-full h-full"
							src={menu}
						/>
						<CardFooter className="flex-col backdrop-blur-md text-foreground/90 justify-between border-fg overflow-hidden absolute before:rounded-xl rounded-large w-[calc(100%-8px)] shadow-small ml-1 z-10">
							<b>{game.name}</b>
							<em>{new Date(game.date).toLocaleDateString()}</em>
							<em>{game.map}</em>
							{humans.join(", ")}
						</CardFooter>
					</Card>
				</DropdownTrigger>
				<GamesOptionDropdown
					game={game}
					setCurrGame={setCurrGame}
					onOpenDelete={onOpenDelete}
					onOpenEdit={onOpenEdit}
				/>
			</Dropdown>
		</>
	);
}
