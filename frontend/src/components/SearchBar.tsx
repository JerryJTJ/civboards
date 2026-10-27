// import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import {
	Autocomplete,
	EmptyState,
	ListBox,
	SearchField,
	Skeleton,
} from "@heroui/react";
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

	return isPending ? (
		<Skeleton className="rounded-xl"></Skeleton>
	) : (
		<>
			{/* <Autocomplete
				// isVirtualized
				aria-label="Search"
				className="max-w-[250px]"
				classNames={{
					base: "border-fg rounded-xl",
					popoverContent: "border-fg rounded-xl",
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
			</Autocomplete> */}
			<Autocomplete
				className="w-[256px]"
				placeholder="Search for user..."
				selectionMode="single"
				aria-labelledby=""
				// value={selectedKey1}
				variant="primary"
				// onChange={setSelectedKey1}
			>
				<Autocomplete.Trigger>
					<Autocomplete.Value />
					<Autocomplete.ClearButton />
					<Autocomplete.Indicator />
				</Autocomplete.Trigger>
				<Autocomplete.Popover>
					<Autocomplete.Filter>
						<SearchField
							autoFocus
							aria-label="Search options"
							name="search"
							variant="secondary"
						>
							<SearchField.Group>
								<SearchField.SearchIcon />
								<SearchField.Input placeholder="Search..." />
								<SearchField.ClearButton />
							</SearchField.Group>
						</SearchField>
						<ListBox
							renderEmptyState={() => <EmptyState>No results found</EmptyState>}
						>
							{data?.map((user) => (
								<ListBox.Item
									key={user.name}
									id={user.name}
									textValue={user.name}
									onPress={() => {
										navigate(`/profile/${user.name}`);
									}}
								>
									{user.name}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Autocomplete.Filter>
				</Autocomplete.Popover>
			</Autocomplete>
		</>
	);
}
