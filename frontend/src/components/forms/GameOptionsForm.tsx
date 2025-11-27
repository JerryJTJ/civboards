import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem, SelectedItems } from "@heroui/select";

import {
	EXPANSIONS,
	Expansion,
	GAMEMODES,
	GAME_SPEED,
	Gamemode,
	MAP_SIZE,
	VICTORY_TYPES,
} from "@constants/gameSettings";
import { GameForm } from "@interfaces/game.interface";
import { ScrollShadow } from "@heroui/scroll-shadow";

type GameOptionsFormProps =
	| {
			enabled: true;
			form: GameForm;
			dispatch: (
				option: string,
				value: string | number | Set<number> | boolean
			) => void;
	  }
	| {
			enabled: false;
			form: GameForm;
	  };

// interface GameOptionsFormProps {
// 	enabled: boolean;
// 	form: GameForm;
// 	dispatch: (
// 		option: string,
// 		value: string | number | Set<number> | boolean
// 	) => void;
// }

function GameOptionsForm(props: GameOptionsFormProps) {
	const { enabled, form } = props;

	return (
		<ScrollShadow className="flex flex-col gap-2">
			<Checkbox
				isDisabled={!enabled}
				isSelected={form.finished}
				onValueChange={() => {
					if (enabled) props.dispatch("finished", !form.finished);
				}}
			>
				<p className="font-normal text-small text-foreground-500">
					Game Finished
				</p>
			</Checkbox>
			<Input
				className="border border-foreground/20 rounded-xl"
				isDisabled={!enabled}
				isRequired={enabled}
				label="Game Name"
				maxLength={30}
				value={form.name}
				onValueChange={(val: string) => {
					if (enabled) props.dispatch("name", val);
				}}
			/>
			{form.finished && (
				<>
					<Select
						className="border border-foreground/20 rounded-xl"
						defaultSelectedKeys={
							form.winnerPlayer === ""
								? undefined
								: new Set([form.winnerPlayer])
						}
						isDisabled={!enabled}
						isRequired={enabled}
						items={form.players}
						label="Winner"
						selectionMode="single"
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							if (enabled) props.dispatch("winner", e.target.value);
						}}
					>
						{(player) =>
							player.name ? (
								<SelectItem key={player.id}>{player.name}</SelectItem>
							) : null
						}
					</Select>
					<Select
						className="border border-foreground/20 rounded-xl"
						defaultSelectedKeys={
							form.victoryId ? new Set([String(form.victoryId)]) : undefined
						}
						isDisabled={!enabled}
						isRequired={enabled}
						items={VICTORY_TYPES}
						label="Victory Type"
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							if (enabled) props.dispatch("victoryId", e.target.value);
						}}
					>
						{(victory) => (
							<SelectItem key={victory.id}>{victory.label}</SelectItem>
						)}
					</Select>
				</>
			)}

			<Select
				className="border border-foreground/20 rounded-xl"
				isDisabled={!enabled}
				isRequired={enabled}
				items={GAME_SPEED}
				label="Game Speed"
				selectedKeys={new Set([form.speed])}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					if (enabled) props.dispatch("speed", e.target.value);
				}}
			>
				{(speed) => <SelectItem>{speed.label}</SelectItem>}
			</Select>
			<Input
				className="border border-foreground/20 rounded-xl"
				isDisabled={!enabled}
				isRequired={enabled}
				label="Map"
				maxLength={20}
				value={form.map}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (enabled) props.dispatch("map", e.target.value);
				}}
			/>
			<Select
				className="border border-foreground/20 rounded-xl"
				isDisabled={!enabled}
				isRequired={enabled}
				items={MAP_SIZE}
				label="Map Size"
				selectedKeys={new Set([form.mapSize])}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					if (enabled) props.dispatch("mapSize", e.target.value);
				}}
			>
				{(size) => <SelectItem>{size.size}</SelectItem>}
			</Select>
			<NumberInput
				className="border border-foreground/20 rounded-xl"
				isWheelDisabled
				datatype="number"
				isDisabled={!enabled}
				isRequired={enabled}
				label="Game Turns"
				maxValue={500}
				minValue={0}
				value={form.turns}
				onValueChange={(val: number) => {
					if (enabled) props.dispatch("turns", val);
				}}
			/>
			<Select
				className="border border-foreground/20 rounded-xl"
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
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					if (enabled)
						props.dispatch(
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
				className="border border-foreground/20 rounded-xl"
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
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					if (enabled)
						props.dispatch(
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
		</ScrollShadow>
	);
}

export default GameOptionsForm;
