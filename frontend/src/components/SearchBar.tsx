import { useQuery } from "@tanstack/react-query";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Skeleton } from "@heroui/skeleton";
import { useNavigate } from "react-router-dom";

import { SearchIcon } from "./icons";

import { capitalize } from "@/utils/capitalize";
import { getAllUsers } from "@/api/users";

export default function SearchBar() {
	const navigate = useNavigate();
	const { data, isPending } = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
	});

	return (
		<Skeleton isLoaded={!isPending} className="rounded-xl">
			{!isPending && (
				<Autocomplete
					isVirtualized
					aria-label="Search"
					className="max-w-[250px]"
					defaultItems={data}
					maxListboxHeight={200}
					placeholder="Search for user..."
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
							{capitalize(user.name)}
						</AutocompleteItem>
					)}
				</Autocomplete>
			)}
		</Skeleton>
	);
}
