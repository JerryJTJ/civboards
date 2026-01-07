import { DisplayGameSchema } from "@civboards/schemas";
import CivField from "@components/forms/CivField";
import GameOptionsForm from "@components/forms/GameOptionsForm";
import { CrossIcon } from "@components/icons";
import getViewportSize from "@components/utils/getViewportSize";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Skeleton } from "@heroui/skeleton";
import { Tab, Tabs } from "@heroui/tabs";
import useWindowDimensions from "@hooks/useWindowDimensions";
import { Civ, GameForm } from "@interfaces/game.interface";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

interface ViewGameCardProps {
	game: z.infer<typeof DisplayGameSchema>;
	isPending: boolean;
	username: string;
	onOpenEdit: () => void;
	onOpenDelete: () => void;
}

export default function ViewGameCard(props: ViewGameCardProps) {
	const { game, isPending, username, onOpenEdit, onOpenDelete } = props;
	const { width } = useWindowDimensions();
	const navigate = useNavigate();

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
		notes: game.notes ?? "",
		mods: new Set(game.mods),
	};

	const gameOptionFields = (
		<ScrollShadow className="lg:max-h-[60vh] overflow-auto pt-2" size={20}>
			<div className="mr-3.5">
				<GameOptionsForm enabled={false} form={form} />
			</div>
		</ScrollShadow>
	);

	const notes = (
		<Textarea
			isReadOnly
			className="border-fg rounded-xl min-w-[50vw]"
			value={form.notes}
		/>
	);

	return (
		<Card
			isBlurred
			className="flex items-center justify-center border-none bg-background/60 dark:bg-default-100/50 "
			shadow="md"
		>
			<CardHeader className="flex-col items-center pt-8 pb-0 px-13">
				<Button
					isIconOnly
					className="self-start border-fg"
					color="default"
					radius="lg"
					variant="shadow"
					onPress={() => {
						navigate("/games");
					}}
				>
					<CrossIcon />
				</Button>
				<h4 className="font-bold text-large">{game.name}</h4>
			</CardHeader>
			<CardBody>
				{getViewportSize(width) === "xs" ? (
					<div className="flex flex-col py-2 sm:px-10 w-[85vw]">
						<Tabs
							aria-label="Options"
							className="self-center border-fg rounded-xl"
						>
							<Tab key="players" className="flex flex-col" title="Players">
								{civFields}
							</Tab>
							<Tab key="options" className="flex flex-col" title="Game Options">
								{gameOptionFields}
							</Tab>
							<Tab key="notes" className="flex flex-col" title="Notes">
								{notes}
							</Tab>
						</Tabs>
					</div>
				) : (
					<Tabs
						aria-label="Options"
						className="self-center border-fg rounded-xl"
					>
						<Tab key="game" className="flex flex-col" title="Game">
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
						</Tab>
						<Tab key="notes" className="flex flex-col" title="Notes">
							<div className="px-10 py-2">{notes}</div>
						</Tab>
					</Tabs>
				)}
			</CardBody>
			<CardFooter className="flex justify-end-safe">
				{username === game.createdBy && getViewportSize(width) != "sm" && (
					<div className="flex flex-row gap-4 me-14">
						<Button
							className="mb-3 border-fg rounded-xl justify-self-end"
							color="primary"
							variant="shadow"
							onPress={onOpenEdit}
						>
							Edit
						</Button>
						<Button
							className="mb-3 border-fg rounded-xl justify-self-end"
							color="danger"
							variant="shadow"
							onPress={onOpenDelete}
						>
							Delete
						</Button>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
