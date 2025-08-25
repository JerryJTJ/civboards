import { Select, SelectItem } from "@heroui/select";
import {
	Autocomplete,
	AutocompleteSection,
	AutocompleteItem,
} from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Civ } from "@/interfaces/game.interface";
import { LEADERS, Leader } from "@/constants/civilizations";

interface CivFieldProps {
	civ: Civ;
	changeDispatch: (civ: Partial<Civ>) => void;
	deleteDispatch: (civ: Civ) => void;
}

export default function CivField(props: CivFieldProps) {
	const { civ, changeDispatch, deleteDispatch } = props;
	//just have civs live on one thing, and get from there

	return (
		<div className="flex flex-row gap-2">
			<Autocomplete
				isRequired
				defaultItems={LEADERS}
				label="Leader"
				variant="bordered"
				selectedKey={civ.leaderId?.toString() || undefined}
				onSelectionChange={(e) =>
					changeDispatch({
						leaderId: Number(e),
						key: civ.key,
					})
				}
			>
				{(leader: Leader) => (
					<AutocompleteItem key={leader.id.toString()}>
						{leader.name}
					</AutocompleteItem>
				)}
			</Autocomplete>
			{civ.isHuman && (
				<Input
					className="w-3/5"
					variant="bordered"
					label="Player Name"
					value={civ.name}
					required={true}
					onChange={(e) =>
						changeDispatch({
							name: e.target.value,
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
							name: civ.isHuman ? "" : civ.name,
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
