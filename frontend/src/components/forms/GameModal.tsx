import { Button } from "@heroui/button";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import { UseMutationResult } from "@tanstack/react-query";
import { useRef } from "react";

import UploadFileInput from "../UploadFileInput";
import { isModalFieldEnabled } from "../utils/isModalFieldEnabled";

import CivField from "./CivField";
import GameOptionsForm from "./GameOptionsForm";
import { getFormDispatches } from "./gameFormDispatches";
import { FormAction } from "./gameFormReducer";

import { Civ, GameOptions } from "@/interfaces/game.interface";

interface AddModalProps {
	mode: "add";
	form: GameOptions;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onOpenChange: () => void;
	mutation: UseMutationResult<void, Error, void, unknown>;
}

interface UpdateModalProps {
	mode: "edit";
	form: GameOptions;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onOpenChange: () => void;
	mutation: UseMutationResult<void, Error, void, unknown>;
}

interface ViewGameProps {
	form: GameOptions;
	mode: "view";
	isOpen: boolean;
	onOpenChange: () => void;
	dispatch: undefined;
}

type GameModalProps = AddModalProps | ViewGameProps | UpdateModalProps;

export default function GameModal(props: GameModalProps) {
	const { mode, isOpen, onOpenChange, form, dispatch } = props;

	const defaultForm = useRef(form);

	// UI
	const headerText = () => {
		switch (mode) {
			case "add":
				return "Add";
			case "view":
				return "View";
			case "edit":
				return "Edit";
		}
	};

	const enabled = isModalFieldEnabled(mode);

	// Dispatches
	const dispatches = dispatch ? getFormDispatches(dispatch, form) : undefined;

	// Modal open/close
	const onModalChange = () => {
		dispatches?.resetFormDispatch(defaultForm.current);
		onOpenChange();
	};

	// Submitting
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mode === "view") return;

		await props.mutation.mutateAsync();
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
								{mode === "add" && dispatches && (
									<UploadFileInput
										dispatch={dispatches.parseSaveDispatch}
										// reset={dispatches.resetFormDispatch}
									/>
								)}
								<div className="flex flex-row justify-evenly">
									<div className="flex flex-col justify-start w-1/2 max-h-full gap-2">
										{" "}
										<span className="self-center pb-2 font-bold">
											Players
										</span>
										<div className="flex flex-col justify-start gap-2 pr-4 overflow-x-hidden overflow-y-auto max-h-[60vh]">
											{form?.players?.map((civ: Civ) => (
												<CivField
													key={civ.id}
													changeDispatch={
														dispatches?.changeCivDispatch ??
														(() => {})
													}
													civ={civ}
													deleteDispatch={
														dispatches?.deleteCivDispatch ??
														(() => {})
													}
													enabled={enabled}
												/>
											))}
										</div>
										{enabled && (
											<div className="flex flex-row gap-2 pt-4">
												<Button
													onPress={() =>
														dispatches?.addCivDispatch(
															true
														)
													}
												>
													Add Human
												</Button>
												<Button
													onPress={() =>
														dispatches?.addCivDispatch(
															false
														)
													}
												>
													Add AI
												</Button>
											</div>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<p className="self-center pb-2 font-bold">
											Game Options
										</p>
										<GameOptionsForm
											dispatch={
												dispatches?.gameOptionsDispatch ??
												(() => {})
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
								{enabled && (
									<Button
										color="primary"
										type="submit"
										variant="shadow"
									>
										{headerText()}
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</form>
		</Modal>
	);
}
