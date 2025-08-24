import * as z from "zod";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { PlusIcon } from "../icons";
import { useReducer } from "react";
import CivField from "./CivField";
import GameOptionsForm from "./GameOptionsForm";
import addGameReducer, {
	AddFormAction,
	GameOptionsAction,
} from "./addGameReducer";
import { Civ, GameOptions } from "@/interfaces/game.interface";
import { DisplayGameSchemaArray, InsertGameSchema } from "@civboards/schemas";
import { insertGame } from "@/api/games";
import UploadFileInput from "../UploadFileInput";
import { DEFAULT_ADD_FORM } from "@/constants/gameDefaults";
import {
	QueryObserverResult,
	RefetchOptions,
	useMutation,
} from "@tanstack/react-query";

interface AddGameModalProps {
	refetch: (
		options?: RefetchOptions | undefined
	) => Promise<
		QueryObserverResult<
			z.infer<typeof DisplayGameSchemaArray> | undefined,
			Error
		>
	>;
}

export default function AddGameModal(props: AddGameModalProps) {
	const { refetch } = props;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [form, dispatch] = useReducer<GameOptions, [action: AddFormAction]>(
		addGameReducer,
		DEFAULT_ADD_FORM
	);

	// Modal open/close
	const onModalChange = () => {
		dispatch({ field: "reset" });
		onOpenChange();
	};

	// Dispatches
	const gameOptionsDispatch = (
		option: string,
		value: string | number | Set<number> | boolean
	) =>
		dispatch({
			field: "options",
			option: option,
			payload: value,
		} as GameOptionsAction);

	const addCivDispatch = (isHuman: boolean) =>
		dispatch({
			field: "player",
			type: "add",
			payload: isHuman,
		});
	const deleteCivDispatch = (civ: Civ) =>
		dispatch({ field: "player", type: "delete", payload: civ });
	const changeCivDispatch = (civ: Partial<Civ>) =>
		dispatch({ field: "player", type: "change", payload: civ });
	const parseSaveDispatch = (parsed: Partial<GameOptions>) =>
		dispatch({ field: "parse", payload: parsed });

	// API
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
			refetch();
		},
		onSuccess: () => {
			addToast({
				title: "Success",
				color: "success",
				description: "Added game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			refetch();
			onModalChange();
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
		<>
			<Button
				className="justify-self-end border-white/20 border-1"
				variant="shadow"
				color="primary"
				endContent={<PlusIcon />}
				onPress={onOpen}
			>
				Add Game
			</Button>
			<Modal
				className="max-h-screen"
				isOpen={isOpen}
				placement="top-center"
				onOpenChange={onModalChange}
				size="5xl"
			>
				<Form onSubmit={onSubmit}>
					{" "}
					<ModalContent className="max-h-screen overflow-y-auto">
						{() => (
							<>
								<ModalHeader className="flex flex-rowgap-2">
									Add Game
								</ModalHeader>
								<ModalBody>
									<UploadFileInput
										dispatch={parseSaveDispatch}
									/>
									<div className="flex flex-row justify-evenly">
										<div className="flex flex-col justify-start w-1/2 max-h-full gap-2">
											{" "}
											<span className="self-center pb-2 font-bold">
												Players
											</span>
											<div className="flex flex-col justify-start max-h-full gap-2 pr-4 overflow-x-hidden overflow-y-auto max-h-[60vh]">
												{form.players.map(
													(civ: Civ) => (
														<CivField
															key={civ.key}
															civ={civ}
															changeDispatch={
																changeCivDispatch
															}
															deleteDispatch={
																deleteCivDispatch
															}
														/>
													)
												)}
											</div>
											<div className="flex flex-row gap-2 pt-4">
												<Button
													onPress={() =>
														addCivDispatch(true)
													}
												>
													Add Human
												</Button>
												<Button
													onPress={() =>
														addCivDispatch(false)
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
												form={form}
												dispatch={gameOptionsDispatch}
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
										type="submit"
										variant="shadow"
										color="primary"
									>
										Add
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Form>
			</Modal>
		</>
	);
}
