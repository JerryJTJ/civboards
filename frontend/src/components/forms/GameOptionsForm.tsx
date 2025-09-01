import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem, SelectedItems } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Checkbox } from "@heroui/checkbox";

import { GameForm } from "@/interfaces/game.interface";
import {
	VICTORY_TYPES,
	GAME_SPEED,
	MAP_SIZE,
	GAMEMODES,
	EXPANSIONS,
	Expansion,
	Gamemode,
} from "@/constants/gameSettings";

interface GameOptionsFormProps {
	enabled: boolean;
	form: GameForm;
	dispatch: (
		option: string,
		value: string | number | Set<number> | boolean
	) => void;
}

function GameOptionsForm(props: GameOptionsFormProps) {
	const { enabled, form, dispatch } = props;

	return (
		<>
			<Checkbox
				isDisabled={!enabled}
				isSelected={form.finished}
				onValueChange={() => {
					dispatch("finished", !form.finished);
				}}
			>
				<p className="font-normal text-small text-foreground-500">
					Game Finished
				</p>
			</Checkbox>
			<Input
				isDisabled={!enabled}
				isRequired={enabled}
				label="Game Name"
				maxLength={20}
				value={form.name}
				variant="bordered"
				onValueChange={(val: string) => dispatch("name", val)}
			/>
			{form.finished && (
				<>
					<Select
						defaultSelectedKeys={
							form.winner === ""
								? undefined
								: new Set([form.winner])
						}
						isDisabled={!enabled}
						isRequired={enabled}
						items={form.players}
						label="Winner"
						selectionMode="single"
						variant="bordered"
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							dispatch("winner", e.target.value)
						}
					>
						{(player) =>
							player.name ? (
								<SelectItem key={player.id}>
									{player.name}
								</SelectItem>
							) : null
						}
					</Select>
					<Select
						defaultSelectedKeys={
							form.victoryId
								? new Set([String(form.victoryId)])
								: undefined
						}
						isDisabled={!enabled}
						isRequired={enabled}
						items={VICTORY_TYPES}
						label="Victory Type"
						variant="bordered"
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							dispatch("victoryId", e.target.value)
						}
					>
						{(victory) => (
							<SelectItem key={victory.id}>
								{victory.label}
							</SelectItem>
						)}
					</Select>
				</>
			)}

			<Select
				isDisabled={!enabled}
				isRequired={enabled}
				items={GAME_SPEED}
				label="Game Speed"
				selectedKeys={new Set([form.speed])}
				variant="bordered"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("speed", e.target.value)
				}
			>
				{(speed) => <SelectItem>{speed.label}</SelectItem>}
			</Select>
			<Input
				isDisabled={!enabled}
				isRequired={enabled}
				label="Map"
				maxLength={20}
				value={form.map}
				variant="bordered"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					dispatch("map", e.target.value)
				}
			/>
			<Select
				isDisabled={!enabled}
				isRequired={enabled}
				items={MAP_SIZE}
				label="Map Size"
				selectedKeys={new Set([form.mapSize])}
				variant="bordered"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					dispatch("mapSize", e.target.value)
				}
			>
				{(size) => <SelectItem>{size.size}</SelectItem>}
			</Select>
			<NumberInput
				isWheelDisabled
				datatype="number"
				isDisabled={!enabled}
				isRequired={enabled}
				label="Game Turns"
				maxValue={500}
				minValue={0}
				value={form.turns}
				variant="bordered"
				onValueChange={(val: number) => dispatch("turns", val)}
			/>
			<Select
				classNames={{
					base: "max-w-xs",
					trigger: "min-h-12 py-2",
				}}
				isDisabled={!enabled}
				isMultiline={true}
				items={EXPANSIONS}
				label="Expansions"
				labelPlacement="inside"
				renderValue={(items: SelectedItems<Expansion>) => {
					return (
						<div className="flex flex-wrap gap-2">
							{items.map((item) => (
								<Chip key={item.key}>{item.data?.label}</Chip>
							))}
						</div>
					);
				}}
				selectedKeys={[...form.expansions].map(String)}
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
				isDisabled={!enabled}
				isMultiline={true}
				items={GAMEMODES}
				label="Gamemodes"
				labelPlacement="inside"
				renderValue={(items: SelectedItems<Gamemode>) => {
					return (
						<div className="flex flex-wrap gap-2">
							{items.map((item) => (
								<Chip key={item.key}>{item.data?.label}</Chip>
							))}
						</div>
					);
				}}
				selectedKeys={[...form.gamemodes].map(String)}
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
