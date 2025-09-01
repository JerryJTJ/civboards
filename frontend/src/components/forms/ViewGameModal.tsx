import { DisplayGameSchema } from "@civboards/schemas";
import z from "zod";

import GameModal from "./GameModal";

interface ViewGameModalProps {
	disclosure: {
		isOpen: boolean;
		onOpen: () => void;
		onClose: () => void;
		onOpenChange: () => void;
		isControlled: boolean;
		getButtonProps: (props?: any) => any;
		getDisclosureProps: (props?: any) => any;
	};
	game: z.infer<typeof DisplayGameSchema>;
}

export default function ViewGameModal(props: ViewGameModalProps) {
	const { game, disclosure } = props;

	return (
		<GameModal
			dispatch={undefined}
			form={{
				...game,
				winner: game.winnerPlayer || "",
				date: Date.parse(game.date),
				victoryId: game.victoryId || undefined,
				expansions: new Set(game.expansions),
				gamemodes: new Set(game.gamemodes),
				players: game.players,
			}}
			isOpen={disclosure.isOpen}
			mode="view"
			onOpenChange={disclosure.onOpenChange}
		/>
	);
}
