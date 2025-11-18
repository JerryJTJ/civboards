import { Button } from "@heroui/button";
import { InsertGameSchema } from "@civboards/schemas";
import { addToast } from "@heroui/toast";
import { useAuth0 } from "@auth0/auth0-react";
import { useDisclosure } from "@heroui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReducer } from "react";

import { PlusIcon } from "@components/icons";
import { ValidateFormError } from "@components/utils/error";
import { validateFormFields } from "@components/utils/validateFormFields";

import GameModal from "./GameModal";
import gameFormReducer, { FormAction } from "./gameFormReducer";

import * as z from "zod";
import { DEFAULT_ADD_FORM } from "@constants/gameDefaults";
import { GameForm } from "@interfaces/game.interface";
import { useGamesAPI } from "@api/games";

export default function AddGameModal() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth0();

	const [form, dispatch] = useReducer<GameForm, [action: FormAction]>(
		gameFormReducer,
		DEFAULT_ADD_FORM
	);

	// API
	const queryClient = useQueryClient();

	const { insertGame } = useGamesAPI();
	const mutation = useMutation({
		mutationFn: async () => {
			const validate = validateFormFields(form, InsertGameSchema);

			if (!validate.success) throw new ValidateFormError(validate.message);

			await insertGame(
				validate.result.data as z.infer<typeof InsertGameSchema>
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
					description: "Failed to add game",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			}
		},
		onSuccess: () => {
			addToast({
				title: "Success",
				color: "success",
				description: "Added game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			dispatch({ field: "reset", payload: DEFAULT_ADD_FORM });
			onClose();
		},
		onSettled: () => {
			void queryClient.invalidateQueries();
		},
	});

	// UI
	const handleOnOpen = () => {
		if (!user)
			addToast({
				title: "Error",
				color: "danger",
				description: "Please login to add a game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		else onOpen();
	};

	return (
		<>
			<Button
				className="border justify-self-end border-white/20"
				color="primary"
				endContent={<PlusIcon />}
				variant="shadow"
				onPress={handleOnOpen}
			>
				Add Game
			</Button>
			<GameModal
				dispatch={dispatch}
				form={form}
				isOpen={isOpen}
				mode="add"
				mutation={mutation}
				onClose={onClose}
			/>
		</>
	);
}
