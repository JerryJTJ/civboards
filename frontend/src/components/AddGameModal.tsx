import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { PlusIcon } from "./icons";
import React, { Key } from "react";
import CivField from "./CivField";
import { GAME_SPEED, MAP_SIZE, VICTORY_TYPES } from "@/constants/gameSettings";
import GameOptionsForm from "./forms/GameOptionsForm";

export const animals = [
	{ key: "cat", label: "Cat" },
	{ key: "dog", label: "Dog" },
];

export interface Civ {
	key: Key;
	playerName: string;
	civilizationName: string;
	isHuman: boolean;
}

interface GameData {
	name: string;
	speed: string;
	mapName: string;
	mapSize: string;
	turns: number;
	winner: string;
	victory: string;
	dlcs: Array<string>;
	expansions: Array<string>;
}

export default function AddGameModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	// const [modalSize, setModalSize] = React.useState<
	// 	| "5xl"
	// 	| "xs"
	// 	| "sm"
	// 	| "md"
	// 	| "lg"
	// 	| "xl"
	// 	| "2xl"
	// 	| "3xl"
	// 	| "4xl"
	// 	| "full"
	// 	| undefined
	// >("5xl");

	const [formCivsData, setFormCivsData] = React.useState<Array<Civ>>([
		{
			key: crypto.randomUUID(),
			playerName: "",
			civilizationName: "",
			isHuman: true,
		},
		{
			key: crypto.randomUUID(),
			playerName: "",
			civilizationName: "",
			isHuman: true,
		},
	]);
	const [formGameData, setFormGameData] = React.useState<GameData>({
		name: "",
		speed: "",
		mapName: "",
		mapSize: "",
		turns: 0,
		winner: "",
		victory: "",
		dlcs: new Array<string>(),
		expansions: new Array<string>(),
	});

	const onCivChange = (updatedCiv: Partial<Civ>, updatedCivKey: Key) => {
		setFormCivsData((prev: Array<Civ>) => {
			return prev.map((civ: Civ) =>
				civ.key === updatedCivKey ? { ...civ, ...updatedCiv } : civ
			);
		});
	};

	const onCivAdd = (human: boolean) => {
		setFormCivsData((prev: Array<Civ>) => [
			...prev,
			{
				key: crypto.randomUUID(),
				playerName: "",
				civilizationName: "",
				isHuman: human,
			},
		]);
	};

	const onCivDelete = (key: Key) => {
		setFormCivsData((prev: Array<Civ>) => {
			return prev.filter((civ: Civ) => civ.key !== key);
		});
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
											{formCivsData.map((civ: Civ) => (
												<CivField
													key={civ.key}
													civ={civ}
													onChange={onCivChange}
													onDelete={onCivDelete}
												/>
											))}
										</div>
										<div className="flex flex-row gap-2 pt-4">
											<Button
												onPress={() => onCivAdd(true)}
											>
												Add Human
											</Button>
											<Button
												onPress={() => onCivAdd(false)}
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
											formCivsData={formCivsData}
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
										onClose();
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
