import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useReducer } from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { PlusIcon } from "../icons";
import GameModal from "../GameModal";

import addGameReducer, { FormAction } from "./addGameReducer";

import { GameOptions } from "@/interfaces/game.interface";
import { DEFAULT_ADD_FORM } from "@/constants/gameDefaults";
import { insertGame } from "@/api/games";

export default function AddGameModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [form, dispatch] = useReducer<GameOptions, [action: FormAction]>(
		addGameReducer,
		DEFAULT_ADD_FORM
	);

	// API
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: insertGame,
		onError: () => {
			addToast({
				title: "Error",
				color: "danger",
				description: "Failed to add game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		},
		onSuccess: () => {
			addToast({
				title: "Success",
				color: "success",
				description: "Added game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			dispatch({ field: "reset" });
			onOpenChange();
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
				onOpenChange={onOpenChange}
			/>
		</>
	);
}
