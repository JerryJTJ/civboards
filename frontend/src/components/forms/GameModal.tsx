import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";
import { UseMutationResult } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo, useRef, useState } from "react";

import getViewportSize from "@components/utils/getViewportSize";

import { FormAction } from "./gameFormReducer";
import { getFormDispatches } from "./gameFormDispatches";
import CivField from "./CivField";
import GameOptionsForm from "./GameOptionsForm";
import UploadFileInput from "./UploadFileInput";

import { Civ, GameForm } from "@interfaces/game.interface";
import { ScrollShadow } from "@heroui/scroll-shadow";
import useWindowDimensions from "@hooks/useWindowDimensions";

interface AddModalProps {
	mode: "add";
	form: GameForm;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onClose: () => void;
	mutation: UseMutationResult<void, Error, void>;
}

interface UpdateModalProps {
	mode: "edit";
	form: GameForm;
	dispatch: React.ActionDispatch<[action: FormAction]>;
	isOpen: boolean;
	onClose: () => void;
	mutation: UseMutationResult<void, Error, void>;
}

type GameModalProps = AddModalProps | UpdateModalProps;

export default function GameModal(props: GameModalProps) {
	const { user } = useAuth0();
	const { width } = useWindowDimensions();

	const { mode, isOpen, onClose, form, dispatch } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const defaultForm = useRef(form);

	// Dispatches
	const {
		addCivDispatch,
		changeCivDispatch,
		deleteCivDispatch,
		gameOptionsDispatch,
		parseSaveDispatch,
		resetFormDispatch,
	} = getFormDispatches(dispatch, form);

	// Modal close
	const onModalClose = () => {
		resetFormDispatch(defaultForm.current);
		onClose();
	};

	// Submitting
	const onSubmit = async () => {
		setLoading(true);

		gameOptionsDispatch("createdBy", user ? (user.username as string) : "");
		try {
			await props.mutation.mutateAsync();
		} catch {
			// TODO: Add logging
		}
		setLoading(false);
	};

	// UI
	const headerText = () => {
		switch (mode) {
			case "add":
				return "Add Game";
			case "edit":
				return "Edit Game";
		}
	};

	// Content
	const civFields = useMemo(() => {
		const display = form.players.map((civ: Civ) => (
			<CivField
				key={civ.id}
				changeDispatch={changeCivDispatch}
				civ={civ}
				deleteDispatch={deleteCivDispatch}
				enabled={true}
			/>
		));

		return (
			<ScrollShadow
				className="flex flex-col justify-start gap-2 overflow-x-hidden overflow-y-auto max-h-[60vh]"
				size={25}
			>
				{display}
			</ScrollShadow>
		);
	}, [form.players, changeCivDispatch, deleteCivDispatch]);

	const gameOptionFields = useMemo(() => {
		return (
			<GameOptionsForm
				dispatch={gameOptionsDispatch}
				enabled={true}
				form={form}
			/>
		);
	}, [form, gameOptionsDispatch]);

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
			<form
				onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
					e.preventDefault();
					void (async () => {
						await onSubmit();
					})();
				}}
			>
				<ModalContent className="overflow-y-auto">
					{() => (
						<>
							<ModalHeader className="flex-col items-center text-center ">
								<p className="pt-2 pl-2 text-center text-large">
									{headerText()}{" "}
								</p>
							</ModalHeader>
							<ModalBody>
								{mode === "add" && (
									<UploadFileInput
										dispatch={parseSaveDispatch}
										// reset={dispatches.resetFormDispatch}
									/>
								)}
								{/* Content for mobile v. web */}
								{getViewportSize(width) === "xs" ? (
									<div className="flex flex-col py-2 sm:px-10">
										<Tabs
											aria-label="Options"
											// color="primary"
										>
											<Tab
												key="players"
												className="flex flex-col"
												title="Players"
											>
												{civFields}
											</Tab>
											<Tab
												key="options"
												className="flex flex-col"
												title="Game Options"
											>
												{gameOptionFields}
											</Tab>
										</Tabs>
									</div>
								) : (
									<div className="grid grid-cols-6 gap-4 px-10 py-2">
										<div className="col-span-4">
											{" "}
											<p className="pb-4 font-bold text-center">Players</p>
											{civFields}
											{
												<div className="flex flex-row gap-2 pt-4">
													<Button
														className="border-fg rounded-xl"
														onPress={() => {
															addCivDispatch(true);
														}}
													>
														Add Human
													</Button>
													<Button
														className="border-fg rounded-xl"
														onPress={() => {
															addCivDispatch(false);
														}}
													>
														Add AI
													</Button>
												</div>
											}
										</div>
										<div className="col-span-2">
											<p className="pb-4 font-bold text-center">Game Options</p>
											{gameOptionFields}
										</div>
									</div>
								)}

								<div className="flex flex-row gap-2" />
							</ModalBody>
							<ModalFooter>
								<Button
									className="border-fg rounded-xl"
									color="danger"
									variant="shadow"
									onPress={onModalClose}
								>
									Close
								</Button>
								{
									<Button
										className="border-fg rounded-xl"
										color="primary"
										isLoading={loading}
										type="submit"
										variant="shadow"
									>
										{headerText()}
									</Button>
								}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</form>
		</Modal>
	);
}
