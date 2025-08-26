import { Button } from "@heroui/button";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import { InsertGameSchema } from "@civboards/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useReducer } from "react";
import z from "zod";

import UploadFileInput from "./UploadFileInput";
import CivField from "./forms/CivField";
import GameOptionsForm from "./forms/GameOptionsForm";
import { getFormDispatches } from "./forms/gameFormDispatches";
import { isModalFieldEnabled } from "./utils/isModalFieldEnabled";
import addGameReducer, { AddFormAction } from "./forms/addGameReducer";

import { insertGame } from "@/api/games";
import { DEFAULT_ADD_FORM } from "@/constants/gameDefaults";
import { Civ, GameOptions } from "@/interfaces/game.interface";

interface AddModalProps {
	mode: "add";
	isOpen: boolean;
	onOpenChange: () => void;
	// onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	// mutation: UseMutationResult<void, Error, GameOptions, unknown>;
	// dispatches: FormDispatches;
}

interface ViewGameProps {
	mode: "view";
	isOpen: boolean;
	onOpenChange: () => void;
}

type GameModalProps = AddModalProps | ViewGameProps;

export default function GameModal(props: GameModalProps) {
	const { mode, isOpen, onOpenChange } = props;

	// UI
	const headerText = () => {
		switch (mode) {
			case "add":
				return "Add";
			case "view":
				return "View";
		}
	};

	const enabled = isModalFieldEnabled(mode);

	const [form, dispatch] = useReducer<GameOptions, [action: AddFormAction]>(
		addGameReducer,
		DEFAULT_ADD_FORM
	);

	// Dispatches
	const dispatches = getFormDispatches(dispatch, form);

	// Modal open/close
	const onModalChange = () => {
		dispatches.resetFormDispatch();
		onOpenChange();
	};

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
			onModalChange();
		},
		onSettled: () => {
			queryClient.invalidateQueries();
		},
	});

	//Validation
	type ValidateResult =
		| { errors: true; message: string }
		| {
				errors: false;
				result: z.ZodSafeParseSuccess<z.infer<typeof InsertGameSchema>>;
		  };

	function validateRequest(form: GameOptions): ValidateResult {
		// Unique player names & >= 2 humans
		const names = new Set<string>();
		let humans: number = 0;

		form.players.forEach((player) => {
			if (player.isHuman) {
				names.add(player.name);
				humans++;
			}
		});
		if (humans < 2)
			return { errors: true, message: "Need 2 or more human players" };
		if (names.size !== humans)
			return {
				errors: true,
				message: "Can't have duplicate player names",
			};

		const winner = form.players.find(
			(player) => player.key === form.winner
		);

		if (!winner && form.finished)
			return { errors: true, message: "Can't find winner" };

		const result = InsertGameSchema.safeParse({
			finished: form.finished,
			date: form.date ? new Date(form.date).toISOString() : undefined,
			name: form.name,
			map: form.map,
			mapSize: form.mapSize,
			speed: form.speed,
			turns: form.turns,
			winnerPlayer: winner?.name,
			winnerLeaderId: winner?.leaderId,
			victoryId: form.victoryId,
			players: form.players,
			expansions: Array.from(form.expansions),
			gamemodes: Array.from(form.gamemodes),
		});

		if (!result.success)
			return {
				errors: true,
				message: "Failed to pass schema",
			};

		return { errors: false, result: result };
	}

	// Submitting
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validate = validateRequest(form);

		if (validate.errors) {
			addToast({
				title: "Error",
				color: "warning",
				description: validate.message,
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});

			return;
		}

		await mutation.mutateAsync(validate.result.data);
	};

	return (
		<Modal
			className="max-h-screen"
			isOpen={isOpen}
			placement="top-center"
			size="5xl"
			onOpenChange={onModalChange}
		>
			<form onSubmit={onSubmit}>
				<ModalContent className="overflow-y-auto">
					{() => (
						<>
							<ModalHeader className="flex flex-row gap-2">
								{headerText()} Game
							</ModalHeader>
							<ModalBody>
								{mode === "add" && (
									<UploadFileInput
										dispatch={dispatches.parseSaveDispatch}
										reset={dispatches.resetFormDispatch}
									/>
								)}
								<div className="flex flex-row justify-evenly">
									<div className="flex flex-col justify-start w-1/2 max-h-full gap-2">
										{" "}
										<span className="self-center pb-2 font-bold">
											Players
										</span>
										<div className="flex flex-col justify-start gap-2 pr-4 overflow-x-hidden overflow-y-auto max-h-[60vh]">
											{form.players.map((civ: Civ) => (
												<CivField
													key={civ.key}
													changeDispatch={
														dispatches.changeCivDispatch
													}
													civ={civ}
													deleteDispatch={
														dispatches.deleteCivDispatch
													}
													enabled={enabled}
												/>
											))}
										</div>
										<div className="flex flex-row gap-2 pt-4">
											<Button
												onPress={() =>
													dispatches.addCivDispatch(
														true
													)
												}
											>
												Add Human
											</Button>
											<Button
												onPress={() =>
													dispatches.addCivDispatch(
														false
													)
												}
											>
												Add AI
											</Button>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<p className="self-center pb-2 font-bold">
											Game Options
										</p>
										<GameOptionsForm
											dispatch={
												dispatches.gameOptionsDispatch
											}
											enabled={enabled}
											form={form}
										/>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="shadow"
									onPress={onModalChange}
								>
									Close
								</Button>
								<Button
									color="primary"
									type="submit"
									variant="shadow"
								>
									Add
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</form>
		</Modal>
	);
}
