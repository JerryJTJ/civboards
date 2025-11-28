import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Skeleton } from "@heroui/skeleton";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { SearchIcon } from "./icons";

import { getAllUsers } from "@api/users";

export default function SearchBar() {
	const navigate = useNavigate();
	const { data, isPending } = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
	});

	return (
		<Skeleton className="rounded-xl" isLoaded={!isPending}>
			{!isPending && (
				<Autocomplete
					// isVirtualized
					aria-label="Search"
					className="max-w-[250px]"
					classNames={{
						base: "border border-foreground/20 rounded-xl",
						popoverContent: "border border-foreground/20 rounded-xl",
					}}
					defaultItems={data ?? []}
					placeholder="Search for user..."
					radius="md"
					size="md"
					startContent={
						<SearchIcon className="text-base pointer-events-none shrink-0 text-default-400" />
					}
				>
					{(user) => (
						<AutocompleteItem
							key={user.name}
							onPress={() => {
								navigate(`/profile/${user.name}`);
							}}
						>
							{user.name}
						</AutocompleteItem>
					)}
				</Autocomplete>
			)}
		</Skeleton>
	);
}
