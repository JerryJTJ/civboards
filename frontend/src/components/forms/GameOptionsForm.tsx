import {
	VICTORY_TYPES,
	GAME_SPEED,
	MAP_SIZE,
	GAMEMODES,
	EXPANSIONS,
} from "@/constants/gameSettings";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { GameOptions } from "@/interfaces/game.interface";

interface GameOptionsFormProps {
	form: GameOptions;
	dispatch: (option: string, value: string | number | Set<number>) => void;
}

function GameOptionsForm(props: GameOptionsFormProps) {
	const { form, dispatch } = props;

	return (
		<>
			<Input
				label="Game Name"
				variant="bordered"
				maxLength={20}
				value={form.name}
				onValueChange={(val: string) => dispatch("name", val)}
				isRequired
			/>
			<Select
				label="Winner"
				variant="bordered"
				items={form.players}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("winner", e.target.value)
				}
				isRequired
			>
				{(civ) =>
					civ.name ? <SelectItem>{civ.name}</SelectItem> : null
				}
			</Select>
			<Select
				label="Victory Type"
				variant="bordered"
				value={form.victoryId}
				items={VICTORY_TYPES}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("victoryId", e.target.value)
				}
				isRequired
			>
				{(victory) => <SelectItem>{victory.label}</SelectItem>}
			</Select>
			<Select
				label="Game Speed"
				variant="bordered"
				value={form.speed}
				items={GAME_SPEED}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("speed", e.target.value)
				}
				isRequired
			>
				{(speed) => <SelectItem>{speed.label}</SelectItem>}
			</Select>
			<Input
				label="Map"
				variant="bordered"
				value={form.map}
				maxLength={20}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					dispatch("map", e.target.value)
				}
				isRequired
			/>
			<Select
				label="Map Size"
				variant="bordered"
				items={MAP_SIZE}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("mapSize", e.target.value)
				}
				isRequired
			>
				{(size) => <SelectItem>{size.size}</SelectItem>}
			</Select>
			<NumberInput
				label="Game Turns"
				variant="bordered"
				isWheelDisabled
				minValue={0}
				maxValue={500}
				datatype="number"
				onValueChange={(val: number) => dispatch("turns", val)}
				isRequired
			/>
			<Select
				classNames={{
					base: "max-w-xs",
					trigger: "min-h-12 py-2",
				}}
				isMultiline={true}
				items={EXPANSIONS}
				label="Expansions"
				labelPlacement="inside"
				renderValue={(expansions) => {
					return (
						<div className="flex flex-wrap gap-2">
							{expansions.map((expansion) => (
								<Chip key={expansion.data?.label}>
									{expansion.data?.label}
								</Chip>
							))}
						</div>
					);
				}}
				selectionMode="multiple"
				variant="bordered"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					dispatch(
						"expansions",
						new Set(e.target.value.split(",").map(Number))
					);
				}}
			>
				{(expansion) => (
					<SelectItem key={expansion.id} textValue={expansion.label}>
						<span className="text-small">{expansion.label}</span>
					</SelectItem>
				)}
			</Select>
			<Select
				classNames={{
					base: "max-w-xs",
					trigger: "min-h-12 py-2",
				}}
				isMultiline={true}
				items={GAMEMODES}
				label="Gamemodes"
				labelPlacement="inside"
				renderValue={(gamemodes) => {
					return (
						<div className="flex flex-wrap gap-2">
							{gamemodes.map((gamemode) => (
								<Chip key={gamemode.data?.label}>
									{gamemode.data?.label}
								</Chip>
							))}
						</div>
					);
				}}
				selectionMode="multiple"
				variant="bordered"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					dispatch(
						"gamemodes",
						new Set(e.target.value.split(",").map(Number))
					);
				}}
			>
				{(gamemode) => (
					<SelectItem key={gamemode.id} textValue={gamemode.label}>
						<span className="text-small">{gamemode.label}</span>
					</SelectItem>
				)}
			</Select>
		</>
	);
}

export default GameOptionsForm;
