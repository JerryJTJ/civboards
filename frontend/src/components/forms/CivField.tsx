import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { Civ } from "@/interfaces/game.interface";
import { LEADERS, Leader } from "@/constants/civilizations";

interface CivFieldProps {
	enabled: boolean;
	civ: Civ;
	changeDispatch: (civ: Partial<Civ>) => void;
	deleteDispatch: (civ: Civ) => void;
}

export default function CivField(props: CivFieldProps) {
	const { enabled, civ, changeDispatch, deleteDispatch } = props;
	//just have civs live on one thing, and get from there

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
				defaultItems={LEADERS}
				isDisabled={!enabled}
				isRequired={enabled}
				label="Leader"
				selectedKey={civ.leaderId?.toString() || undefined}
				variant="bordered"
				onSelectionChange={(e) => {
					changeDispatch({
						leaderId: Number(e),
						id: civ.id,
					});
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
					className="w-3/5"
					isDisabled={!enabled}
					isRequired={enabled}
					label="Player Name"
					required={true}
					value={civ.name}
					variant="bordered"
					onChange={(e) =>
						changeDispatch({
							name: e.target.value,
							id: civ.id,
						})
					}
				/>
			)}
			<div className="flex flex-col content-center">
				<Link
					isBlock
					className="justify-center"
					color="foreground"
					isDisabled={!enabled}
					size="sm"
					onPress={() => {
						changeDispatch({
							name: civ.isHuman ? "" : civ.name,
							isHuman: !civ.isHuman,
							id: civ.id,
						});
					}}
				>
					{civ.isHuman ? "Human" : "AI"}
				</Link>
				{enabled && (
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
				)}
			</div>
		</div>
	);
}
