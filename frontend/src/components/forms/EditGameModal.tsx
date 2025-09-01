import { DisplayGameSchema, UpdateGameSchema } from "@civboards/schemas";
import { useReducer } from "react";
import z from "zod";
import { addToast } from "@heroui/toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { ValidationError } from "../utils/error";
import { validateFormFields } from "../utils/validateFormFields";

import gameFormReducer, { FormAction } from "./gameFormReducer";
import GameModal from "./GameModal";

import { updateGame } from "@/api/games";
import { GameForm } from "@/interfaces/game.interface";



interface UpdateGameModalProps {
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

export default function EditGameModal(props: UpdateGameModalProps) {
	const { game, disclosure } = props;

	const winner = game.players.find(
		(player) => player.name === game.winnerPlayer
	)?.id;

	const gameForm: GameForm = {
		...game,
		winner: winner || "",
		date: Date.parse(game.date),
		victoryId: game.victoryId || undefined,
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

	const mutation = useMutation({
		mutationFn: async () => {
			const validate = validateFormFields(
				form,
				UpdateGameSchema,
				game.id
			);

			if (!validate.success) throw new ValidationError(validate.message);

			await updateGame(validate.result.data);
		},
		onError: (error) => {
			if (error instanceof ValidationError) {
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
			queryClient.invalidateQueries();
		},
	});

	return (
		<GameModal
			dispatch={dispatch}
			form={form}
			isOpen={disclosure.isOpen}
			mode="edit"
			mutation={mutation}
			onOpenChange={disclosure.onOpenChange}
		/>
	);
}
