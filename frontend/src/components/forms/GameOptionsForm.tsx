import { VICTORY_TYPES, GAME_SPEED, MAP_SIZE } from "@/constants/gameSettings";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem } from "@heroui/select";
import { Civ } from "../AddGameModal";
import { useState } from "react";

interface GameOptionsFormProps {
	formCivsData: Array<Civ>;
}

interface GameOptions {
	name: string;
	speed: string;
	map: string;
	mapSize: string;
	turns: number | undefined;
	winner: string;
	victory: string;
	isFinished: boolean;
}

const defaultGameOptions: GameOptions = {
	name: "",
	speed: "",
	map: "",
	mapSize: "",
	turns: undefined,
	winner: "",
	victory: "",
	isFinished: true,
};

function GameOptionsForm(props: GameOptionsFormProps) {
	const { formCivsData } = props;

	const [gameOptionsData, setGameOptionsData] =
		useState<GameOptions>(defaultGameOptions);

	return (
		<>
			<Input
				label="Game Name"
				variant="bordered"
				maxLength={20}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						name: e.target.value,
					});
				}}
				isRequired
			/>
			<Select
				label="Winner"
				variant="bordered"
				items={formCivsData}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						winner: e.target.value,
					});
				}}
				isRequired
			>
				{(formCivsData) =>
					formCivsData.playerName ? (
						<SelectItem>{formCivsData.playerName}</SelectItem>
					) : null
				}
			</Select>
			<Select
				label="Victory Type"
				variant="bordered"
				items={VICTORY_TYPES}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						victory: e.target.value,
					});
				}}
				isRequired
			>
				{(victory) => <SelectItem>{victory.label}</SelectItem>}
			</Select>
			<Select
				label="Game Speed"
				variant="bordered"
				items={GAME_SPEED}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						speed: e.target.value,
					});
				}}
				isRequired
			>
				{(speed) => <SelectItem>{speed.label}</SelectItem>}
			</Select>
			<Input
				label="Map"
				variant="bordered"
				maxLength={20}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						map: e.target.value,
					});
				}}
				isRequired
			/>
			<Select
				label="Map Size"
				variant="bordered"
				items={MAP_SIZE}
				onChange={(e) => {
					setGameOptionsData({
						...gameOptionsData,
						mapSize: e.target.value,
					});
				}}
				isRequired
			>
				{(size) => <SelectItem>{size.size}</SelectItem>}
			</Select>
			<NumberInput
				label="Game Turns"
				variant="bordered"
				isWheelDisabled
				minValue={0}
				datatype="number"
				onValueChange={(e: number) => {
					setGameOptionsData({ ...gameOptionsData, turns: e });
				}}
				isRequired
			/>
		</>
	);
}

export default GameOptionsForm;
