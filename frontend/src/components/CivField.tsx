import React, { Key } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Civ } from "./AddGameModal";

export const civilizations = [
	{ key: "rome", label: "Rome (Julius Caesar)" },
	{ key: "egypt", label: "Egypt (Cleopatra)" },
	{ key: "japan", label: "Japan (Tokugawa)" },
	{ key: "germany", label: "Germany (Frederick Barbarossa)" },
	{ key: "france", label: "France (Catherine de Medici)" },
	{ key: "greece", label: "Greece (Pericles)" },
	{ key: "china", label: "China (Qin Shi Huang)" },
	{ key: "america", label: "America (Teddy Roosevelt)" },
	{ key: "mongolia", label: "Mongolia (Genghis Khan)" },
	{ key: "england", label: "England (Victoria)" },
];

interface CivFieldProps {
	civ: Civ;
	onChange: (updatedCiv: Partial<Civ>, updatedCivKey: Key) => void;
	onDelete: (key: Key) => void;
}

export default function CivField(props: CivFieldProps) {
	const { civ, onChange, onDelete } = props;
	//just have civs live on one thing, and get from there

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 ">
				<Select
					items={civilizations}
					label="Civilization"
					required={true}
					variant="bordered"
					onChange={(e) =>
						onChange({ civilizationName: e.target.value }, civ.key)
					}
				>
					{(civilization) => (
						<SelectItem>{civilization.label}</SelectItem>
					)}
				</Select>
				<div className="flex flex-col content-center gap-2">
					{" "}
					<Checkbox
						size="sm"
						isSelected={civ.isHuman}
						onValueChange={() =>
							onChange({ isHuman: !civ.isHuman }, civ.key)
						}
					>
						Human
					</Checkbox>
					<span
						className="text-sm text-red-400 cursor-pointer"
						onClick={() => onDelete(civ.key)}
					>
						Remove
					</span>
					{/* <Button radius="full" size="sm">
						X
					</Button> */}
				</div>
			</div>
			{civ.isHuman && (
				<Input
					variant="bordered"
					label="Player Name"
					value={civ.playerName}
					required={true}
					onChange={(e) =>
						onChange({ playerName: e.target.value }, civ.key)
					}
				/>
			)}
		</div>
	);
}
