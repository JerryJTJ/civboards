import { DisplayGameSchema } from "@civboards/schemas";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import z from "zod";

interface GameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
}

export default function GamesCard(props: GameCardProps) {
	const { game } = props;

	let humans = new Array<string>();
	game.players.forEach((player) => {
		if (player.isHuman) humans.push(player.name);
	});

	return (
		<Card
			className="flex items-center justify-center object-none min-w-[150px] md:min-w-[200px] sm:h-[70vh] col-span-12 sm:col-span-7 2xl:min-w-[10vw] border-white/20 border-1"
			isFooterBlurred
			isPressable
			shadow="sm"
			onPress={undefined}
		>
			<Image
				removeWrapper
				isZoomed
				alt={game.name}
				className="z-0 object-cover w-full h-full"
				src="https://i.imgur.com/ReQSfcb.png"
			/>
			<CardFooter className="flex-col backdrop-blur-md text-foreground/90 justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden absolute before:rounded-xl rounded-large w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
				<b>{game.name}</b>
				<em>{new Date(game.date).toLocaleDateString()}</em>
				<em>{game.map}</em>
				{humans.join(", ")}
			</CardFooter>
		</Card>
	);
}
