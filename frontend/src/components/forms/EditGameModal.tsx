import * as z from "zod";
import { DisplayGameSchema, UpdateGameSchema } from "@civboards/schemas";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReducer } from "react";

import { ValidateFormError } from "@components/utils/error";
import { validateFormFields } from "@components/utils/validateFormFields";

import GameModal from "./GameModal";
import gameFormReducer, { FormAction } from "./gameFormReducer";

import { GameForm } from "@interfaces/game.interface";
import { useGamesAPI } from "@api/games";

interface UpdateGameModalProps {
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

export default function EditGameModal(props: UpdateGameModalProps) {
	const { game, disclosure } = props;

	const winner = game.players.find(
		(player) => player.name === game.winnerPlayer
	)?.id;

	const gameForm: GameForm = {
		...game,
		winnerPlayer: winner ?? "",
		date: Date.parse(game.date),
		victoryId: game.victoryId ?? undefined,
		expansions: new Set(game.expansions),
		gamemodes: new Set(game.gamemodes),
		players: game.players,
	};

	const [form, dispatch] = useReducer<GameForm, [action: FormAction]>(
		gameFormReducer,
		gameForm
	);

	// API
	const queryClient = useQueryClient();
	const { updateGame } = useGamesAPI();

	const mutation = useMutation({
		mutationFn: async () => {
			const validate = validateFormFields(form, UpdateGameSchema, game.id);

			if (!validate.success) throw new ValidateFormError(validate.message);

			await updateGame(
				validate.result.data as z.infer<typeof UpdateGameSchema>
			);
		},
		onError: (error) => {
			if (error instanceof ValidateFormError) {
				addToast({
					title: "Error",
					color: "warning",
					description: error.message,
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			} else {
				addToast({
					title: "Error",
					color: "danger",
					description: "Failed to edit game",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			}
		},
		onSuccess: () => {
			addToast({
				title: "Success",
				color: "success",
				description: "Edited game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			dispatch({ field: "reset", payload: form });
			disclosure.onOpenChange();
		},
		onSettled: () => {
			void queryClient.invalidateQueries();
		},
	});

	return (
		<GameModal
			dispatch={dispatch}
			form={form}
			isOpen={disclosure.isOpen}
			mode="edit"
			mutation={mutation}
			onClose={disclosure.onClose}
		/>
	);
}
