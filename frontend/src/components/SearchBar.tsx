import { Input } from "@heroui/input";
import { SearchIcon } from "./icons";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Link } from "@heroui/link";
import { capitalize } from "@/utils/capitalize";
import { Skeleton } from "@heroui/skeleton";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
	const navigate = useNavigate();
	const { data, isPending } = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
	});

	return (
		<Skeleton isLoaded={!isPending}>
			{!isPending && (
				<Autocomplete
					aria-label="Search"
					defaultItems={data}
					placeholder="Search for user..."
					startContent={
						<SearchIcon className="text-base pointer-events-none shrink-0 text-default-400" />
					}
					size="md"
					className="max-w-[250px]"
					isVirtualized
					maxListboxHeight={200}
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
