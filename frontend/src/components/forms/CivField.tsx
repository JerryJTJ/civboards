import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { Civ } from "@/interfaces/game.interface";
import { LEADERS, Leader } from "@/constants/civilizations";
import { Image } from "@heroui/image";
import { useState } from "react";

interface CivFieldProps {
	civ: Civ;
	changeDispatch: (civ: Partial<Civ>) => void;
	deleteDispatch: (civ: Civ) => void;
}

export default function CivField(props: CivFieldProps) {
	const { civ, changeDispatch, deleteDispatch } = props;
	//just have civs live on one thing, and get from there

	const [leaderId, setLeaderId] = useState<number>();

	return (
		<div className="flex flex-row items-center gap-1">
			{/* <Image
				classNames={{ wrapper: "m-1" }}
				width={120}
				loading="eager"
				shadow="sm"
				radius="full"
				src={LEADERS.find((leader) => leader.id === leaderId)?.image}
			/> */}
			<Autocomplete
				isRequired
				defaultItems={LEADERS}
				label="Leader"
				selectedKey={civ.leaderId?.toString() || undefined}
				variant="bordered"
				onSelectionChange={(e) => {
					changeDispatch({
						leaderId: Number(e),
						key: civ.key,
					});
					setLeaderId(Number(e));
				}}
			>
				{(leader: Leader) => (
					<AutocompleteItem key={leader.id.toString()}>
						{leader.name}
					</AutocompleteItem>
				)}
			</Autocomplete>
			{civ.isHuman && (
				<Input
					isRequired
					className="w-3/5"
					label="Player Name"
					required={true}
					value={civ.name}
					variant="bordered"
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
					isBlock
					className="justify-center"
					color="foreground"
					size="sm"
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
					isBlock
					color="danger"
					size="sm"
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
