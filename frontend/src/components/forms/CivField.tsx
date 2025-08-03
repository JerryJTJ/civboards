import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Civ } from "@/interfaces/game.interface";

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
	changeDispatch: (civ: Partial<Civ>) => void;
	deleteDispatch: (civ: Civ) => void;
}

export default function CivField(props: CivFieldProps) {
	const { civ, changeDispatch, deleteDispatch } = props;
	//just have civs live on one thing, and get from there

	return (
		<div className="flex flex-row gap-2 ">
			<Select
				items={civilizations}
				label="Civilization"
				required={true}
				variant="bordered"
				onChange={(e) =>
					changeDispatch({
						civilizationName: e.target.value,
						key: civ.key,
					})
				}
			>
				{(civilization) => (
					<SelectItem>{civilization.label}</SelectItem>
				)}
			</Select>
			{civ.isHuman && (
				<Input
					variant="bordered"
					label="Player Name"
					value={civ.playerName}
					required={true}
					onChange={(e) =>
						changeDispatch({
							playerName: e.target.value,
							key: civ.key,
						})
					}
				/>
			)}
			<div className="flex flex-col content-center">
				<Link
					size="sm"
					className="justify-center"
					color="foreground"
					isBlock
					onPress={() => {
						changeDispatch({
							playerName: civ.isHuman ? "" : civ.playerName,
							isHuman: !civ.isHuman,
							key: civ.key,
						});
					}}
				>
					{civ.isHuman ? "Human" : "AI"}
				</Link>
				<Link
					size="sm"
					color="danger"
					isBlock
					onPress={() => {
						deleteDispatch(civ);
					}}
				>
					Remove
				</Link>
			</div>
		</div>
	);
}
