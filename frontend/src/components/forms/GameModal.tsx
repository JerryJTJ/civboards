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

import { Civ, GameForm } from "@/interfaces/game.interface";
import { useAuth0 } from "@auth0/auth0-react";

interface AddModalProps {
	mode: "add";
	form: GameForm;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onClose: () => void;
	mutation: UseMutationResult<void, Error, void, unknown>;
}

interface UpdateModalProps {
	mode: "edit";
	form: GameForm;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onClose: () => void;
	mutation: UseMutationResult<void, Error, void, unknown>;
}

interface ViewGameProps {
	form: GameForm;
	mode: "view";
	isOpen: boolean;
	onClose: () => void;
	dispatch: undefined;
}

type GameModalProps = AddModalProps | ViewGameProps | UpdateModalProps;

export default function GameModal(props: GameModalProps) {
	const { user } = useAuth0();

	const { mode, isOpen, onClose, form, dispatch } = props;

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

	// Modal close
	const onModalClose = () => {
		dispatches?.resetFormDispatch(defaultForm.current);
		onClose();
	};
	// Submitting
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mode === "view") return;

		dispatches?.gameOptionsDispatch("createdBy", user?.username || "");
		await props.mutation.mutateAsync();
	};

	return (
		<Modal
			backdrop="blur"
			className="max-h-screen game-modal"
			classNames={{
				closeButton: "m-4 scale-150 hover:bg-danger/75 active:red/100",
			}}
			isDismissable={false}
			isOpen={isOpen}
			placement="top-center"
			size="5xl"
			onClose={onModalClose}
		>
			<form onSubmit={onSubmit}>
				<ModalContent className="overflow-y-auto">
					{() => (
						<>
							<ModalHeader className="flex flex-row">
								<p className="pt-2 pl-2 text-large">
									{headerText()} Game
								</p>
							</ModalHeader>
							<ModalBody>
								{mode === "add" && dispatches && (
									<UploadFileInput
										dispatch={dispatches.parseSaveDispatch}
										// reset={dispatches.resetFormDispatch}
									/>
								)}
								<div className="grid grid-cols-6 gap-4 px-10 py-2">
									<div className="col-span-4">
										{" "}
										<p className="self-center pb-4 font-bold">
											Players
										</p>
										<div className="flex flex-col justify-start gap-2 overflow-x-hidden overflow-y-auto max-h-[60vh]">
											{form.players.map((civ: Civ) => (
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
									<div className="col-span-2">
										<p className="self-center pb-4 font-bold">
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
									onPress={onModalClose}
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
