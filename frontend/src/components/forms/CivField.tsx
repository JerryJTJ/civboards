import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import getViewportSize from "@components/utils/getViewportSize";

import { Civ } from "@interfaces/game.interface";
import { LEADERS, Leader } from "@constants/civilizations";
import useWindowDimensions from "@hooks/useWindowDimensions";

// interface CivFieldProps {
// 	enabled: boolean;
// 	civ: Civ;
// 	changeDispatch: (civ: Partial<Civ>) => void;
// 	deleteDispatch: (civ: Civ) => void;
// }

type CivFieldProps =
	| {
			enabled: true;
			civ: Civ;
			changeDispatch: (civ: Partial<Civ>) => void;
			deleteDispatch: (civ: Civ) => void;
	  }
	| { enabled: false; civ: Civ };

export default function CivField(props: CivFieldProps) {
	const { enabled, civ } = props;
	//just have civs live on one thing, and get from there

	const { width } = useWindowDimensions();

	return (
		<div className="grid grid-cols-6">
			{/* <Image
				classNames={{ wrapper: "m-1" }}
				width={120}
				loading="eager"
				shadow="sm"
				radius="full"
				src={LEADERS.find((leader) => leader.id === leaderId)?.image}
			/> */}
			<div className="col-span-5">
				<div className="flex flex-row gap-2">
					{/* We use input instead of autocomplete for view because autocomplete cuts off the leader text for mobile view (mobile only allows view so its always disabled) */}
					{enabled ? (
						<Autocomplete
							classNames={{
								base: "border-fg rounded-xl",
								popoverContent: "border-fg rounded-xl",
							}}
							defaultItems={LEADERS}
							isReadOnly={!enabled}
							isRequired={enabled}
							label="Leader"
							selectedKey={civ.leaderId?.toString() ?? undefined}
							size={getViewportSize(width) === "xs" ? "sm" : "md"}
							onSelectionChange={(e) => {
								props.changeDispatch({
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
					) : (
						<Input
							className="border-fg rounded-xl"
							isReadOnly={!enabled}
							label="Leader"
							value={LEADERS.find((leader) => leader.id === civ.leaderId)?.name}
						/>
					)}

					{civ.isHuman &&
						(enabled ? (
							<Input
								className="border-fg rounded-xl"
								isRequired={enabled}
								label="Player"
								required={true}
								value={civ.name}
								onChange={(e) => {
									props.changeDispatch({
										name: e.target.value,
										id: civ.id,
									});
								}}
							/>
						) : (
							<Link href={`/profile/${civ.name}`}>
								<Input
									isReadOnly
									className="border-fg rounded-xl hover:cursor-pointer"
									classNames={{
										inputWrapper: "!cursor-pointer",
										input: "!cursor-pointer",
										label: "!cursor-pointer",
									}}
									isRequired={enabled}
									label="Player"
									required={true}
									value={civ.name}
								/>
							</Link>
						))}
				</div>
			</div>
			<div className="self-center col-span-1">
				{" "}
				<div className="flex flex-col mx-1">
					<Link
						isBlock
						className="justify-center"
						color="foreground"
						size="sm"
						onPress={() => {
							if (enabled)
								props.changeDispatch({
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
							className="justify-center"
							color="danger"
							size="sm"
							onPress={() => {
								props.deleteDispatch(civ);
							}}
						>
							Remove
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
