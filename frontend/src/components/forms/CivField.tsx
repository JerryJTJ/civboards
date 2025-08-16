import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Civ } from "@/interfaces/game.interface";
import { LEADERS } from "@/constants/civilizations";

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
				items={LEADERS}
				label="Leader"
				isRequired
				variant="bordered"
				selectedKeys={
					civ.leaderId ? new Set([civ.leaderId]) : undefined
				}
				onChange={(e) =>
					changeDispatch({
						leaderId: Number(e.target.value),
						key: civ.key,
					})
				}
			>
				{(leader) => <SelectItem>{leader.name}</SelectItem>}
			</Select>
			{civ.isHuman && (
				<Input
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
