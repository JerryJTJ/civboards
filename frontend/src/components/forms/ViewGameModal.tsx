import * as z from "zod";
import { DisplayGameSchema } from "@civboards/schemas";

import GameModal from "./GameModal";

interface ViewGameModalProps {
	disclosure: {
		isOpen: boolean;
		onOpen: () => void;
		onClose: () => void;
		onOpenChange: () => void;
		isControlled: boolean;
		getButtonProps: (props?: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
		getDisclosureProps: (props?: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
		// The disclosure is from useDisclosure hook from HeroUI
		// It's internally typed as any so
	};
	game: z.infer<typeof DisplayGameSchema>;
}

export default function ViewGameModal(props: ViewGameModalProps) {
	const { game, disclosure } = props;

	const winner = game.players.find(
		(player) => player.name === game.winnerPlayer
	)?.id;

	return (
		<GameModal
			dispatch={undefined}
			form={{
				...game,
				winner: winner ?? "",
				date: Date.parse(game.date),
				victoryId: game.victoryId ?? undefined,
				expansions: new Set(game.expansions),
				gamemodes: new Set(game.gamemodes),
				players: game.players,
			}}
			isOpen={disclosure.isOpen}
			mode="view"
			onClose={disclosure.onClose}
		/>
	);
}
