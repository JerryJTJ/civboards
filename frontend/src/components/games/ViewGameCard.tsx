import { DisplayGameSchema } from "@civboards/schemas";
import CivField from "@components/forms/CivField";
import GameOptionsForm from "@components/forms/GameOptionsForm";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Skeleton } from "@heroui/skeleton";
import { Civ, GameForm } from "@interfaces/game.interface";
import { useMemo } from "react";
import * as z from "zod";

interface ViewGameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
	isPending: boolean;
	username: string;
	onOpenEdit: () => void;
}

export default function ViewGameCard(props: ViewGameCardProps) {
	const { game, isPending, username, onOpenEdit } = props;

	const civFields = (
		<ScrollShadow
			className="overflow-x-hidden overflow-y-auto max-h-[60vh] pt-2"
			size={10}
		>
			<div className="flex flex-col justify-start gap-2 mr-2">
				{game.players.map((civ: Civ) => (
					<CivField key={civ.id} civ={civ} enabled={false} />
				))}
			</div>
		</ScrollShadow>
	);

	const winner =
		game.winnerPlayer &&
		game.players.find((player) => player.name === game.winnerPlayer)?.id;

	const form: GameForm = {
		...game,
		winnerPlayer: winner ?? "",
		date: Date.parse(game.date),
		victoryId: game.victoryId ?? undefined,
		expansions: new Set(game.expansions),
		gamemodes: new Set(game.gamemodes),
		players: game.players,
	};

	const gameOptionFields = useMemo(() => {
		return (
			<ScrollShadow className="lg:max-h-[60vh] overflow-auto pt-2" size={20}>
				<div className="mr-3.5">
					<GameOptionsForm enabled={false} form={form} />
				</div>
			</ScrollShadow>
		);
	}, [game]);

	return (
		<Card
			isBlurred
			className="flex items-center justify-center border-none bg-background/60 dark:bg-default-100/50 "
			shadow="md"
		>
			<CardHeader className="flex-col items-center pt-8 pb-0 px-13">
				<h4 className="font-bold text-large">{game.name}</h4>
			</CardHeader>
			<CardBody>
				<div className="grid grid-cols-6 gap-4 px-10 py-2 lg:max-h-[70vh]">
					<div className="col-span-4">
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							{" "}
							<p className="pb-4 font-bold text-center">Players</p>
							{civFields}
						</Skeleton>
					</div>

					<div className="col-span-2">
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<p className="pb-4 overflow-scroll font-bold text-center">
								Game Options
							</p>
							{gameOptionFields}
						</Skeleton>
					</div>
				</div>
			</CardBody>
			<CardFooter className="flex justify-end-safe">
				{username === game.createdBy && (
					<Button
						className="mb-3 border me-10 border-foreground/20 rounded-xl justify-self-end"
						color="primary"
						variant="shadow"
						onPress={onOpenEdit}
					>
						Edit
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
