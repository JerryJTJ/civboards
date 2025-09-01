import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useReducer } from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { PlusIcon } from "../icons";
import GameModal from "./GameModal";

import gameFormReducer, { FormAction } from "./gameFormReducer";

import { GameForm } from "@/interfaces/game.interface";
import { DEFAULT_ADD_FORM } from "@/constants/gameDefaults";
import { insertGame } from "@/api/games";
import { InsertGameSchema } from "@civboards/schemas";

import { ValidationError } from "../utils/error";
import { validateFormFields } from "../utils/validateFormFields";

export default function AddGameModal() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [form, dispatch] = useReducer<GameForm, [action: FormAction]>(
		gameFormReducer,
		DEFAULT_ADD_FORM
	);

	// API
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			const validate = validateFormFields(form, InsertGameSchema);
			if (!validate.success) throw new ValidationError(validate.message);

			await insertGame(validate.result.data);
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
				description: "Added game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			dispatch({ field: "reset", payload: DEFAULT_ADD_FORM });
			onClose();
		},
		onSettled: () => {
			queryClient.invalidateQueries();
		},
	});

	return (
		<>
			<Button
				className="border justify-self-end border-white/20"
				color="primary"
				endContent={<PlusIcon />}
				variant="shadow"
				onPress={onOpen}
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
