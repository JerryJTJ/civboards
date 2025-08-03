import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { PlusIcon } from "../icons";
import { Reducer, useReducer } from "react";
import CivField from "./CivField";
import GameOptionsForm from "./GameOptionsForm";
import addGameReducer, {
	AddFormAction,
	GameOptionsAction,
} from "./addGameReducer";
import { DEFAULT_ADD_FORM } from "@/constants/gameSettings";
import { Civ, GameOptions } from "@/interfaces/game.interface";

export default function AddGameModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [form, dispatch] = useReducer<Reducer<GameOptions, AddFormAction>>(
		addGameReducer,
		DEFAULT_ADD_FORM
	);

	const gameOptionsDispatch = (
		option: string,
		value: string | number | Set<number>
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
				onOpenChange={onOpenChange}
				size="5xl"
			>
				<ModalContent className="max-h-screen overflow-y-auto">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-rowgap-2">
								Add Game
							</ModalHeader>
							<ModalBody>
								<Button
									className="self-center max-w-1/2"
									color="primary"
									variant="shadow"
								>
									Upload Save File
								</Button>
								<div className="flex flex-row justify-evenly">
									<div className="flex flex-col justify-start w-1/2 max-h-full gap-2">
										{" "}
										<span className="self-center pb-2 font-bold">
											Civilizations
										</span>
										<div className="flex flex-col justify-start max-h-full gap-2 pr-4 overflow-x-hidden overflow-y-auto max-h-[60vh]">
											{form.players.map((civ: Civ) => (
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
											))}
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
									onPress={onClose}
								>
									Close
								</Button>
								<Button
									variant="shadow"
									color="primary"
									onPress={() => {
										console.log(form);
										// onClose();
									}}
								>
									Add
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
