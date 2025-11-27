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

import { isModalFieldEnabled } from "@components/utils/isModalFieldEnabled";
import getViewportSize from "@components/utils/getViewportSize";

import { FormAction } from "./gameFormReducer";
import { getFormDispatches } from "./gameFormDispatches";
import CivField from "./CivField";
import GameOptionsForm from "./GameOptionsForm";
import UploadFileInput from "./UploadFileInput";

import { Civ, GameForm } from "@interfaces/game.interface";
import useWindowDimensions from "@hooks/useWindowDimensions";
import { ScrollShadow } from "@heroui/scroll-shadow";

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
	const { width } = useWindowDimensions();

	const { mode, isOpen, onClose, form, dispatch } = props;

	const defaultForm = useRef(form);

	const [loading, setLoading] = useState<boolean>(false);

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
	const onSubmit = async () => {
		if (mode === "view") return;

		setLoading(true);

		dispatches?.gameOptionsDispatch(
			"createdBy",
			user ? (user.username as string) : ""
		);
		try {
			await props.mutation.mutateAsync();
		} catch {
			// TODO: Add logging
		}
		setLoading(false);
	};

	// Content
	const civFields = useMemo(() => {
		const display = enabled
			? dispatches
				? form.players.map((civ: Civ) => (
						<CivField
							key={civ.id}
							changeDispatch={dispatches.changeCivDispatch}
							civ={civ}
							deleteDispatch={dispatches.deleteCivDispatch}
							enabled={enabled}
						/>
					))
				: null
			: form.players.map((civ: Civ) => (
					<CivField key={civ.id} civ={civ} enabled={enabled} />
				));

		return (
			<ScrollShadow
				className="flex flex-col justify-start gap-2 overflow-x-hidden overflow-y-auto max-h-[60vh]"
				size={25}
			>
				{display}
			</ScrollShadow>
		);
	}, [dispatches, enabled, form.players]);

	const gameOptionFields = useMemo(() => {
		if (enabled && dispatches) {
			return (
				<GameOptionsForm
					dispatch={dispatches.gameOptionsDispatch}
					enabled={enabled}
					form={form}
				/>
			);
		} else if (!enabled) {
			return <GameOptionsForm enabled={enabled} form={form} />;
		}
	}, [dispatches, enabled, form]);

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
							<ModalHeader className="flex flex-row">
								<p className="pt-2 pl-2 text-large">{headerText()} Game</p>
							</ModalHeader>
							<ModalBody>
								{mode === "add" && dispatches && (
									<UploadFileInput
										dispatch={dispatches.parseSaveDispatch}
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
											<p className="self-center pb-4 font-bold">Players</p>
											{civFields}
											{enabled && (
												<div className="flex flex-row gap-2 pt-4">
													<Button
														className="border border-foreground/20 rounded-xl"
														onPress={() => dispatches?.addCivDispatch(true)}
													>
														Add Human
													</Button>
													<Button
														className="border border-foreground/20 rounded-xl"
														onPress={() => dispatches?.addCivDispatch(false)}
													>
														Add AI
													</Button>
												</div>
											)}
										</div>
										<div className="col-span-2">
											<p className="self-center pb-4 font-bold">Game Options</p>
											{gameOptionFields}
										</div>
									</div>
								)}

								<div className="flex flex-row gap-2" />
							</ModalBody>
							<ModalFooter>
								<Button
									className="border border-foreground/20 rounded-xl"
									color="danger"
									variant="shadow"
									onPress={onModalClose}
								>
									Close
								</Button>
								{enabled && (
									<Button
										className="border border-foreground/20 rounded-xl"
										color="primary"
										isLoading={loading}
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
