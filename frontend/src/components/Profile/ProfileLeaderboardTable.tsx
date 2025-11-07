import { Key, useMemo, useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	SortDescriptor,
} from "@heroui/table";

interface Item {
	name: string;
	played: number;
	wins: number;
}

interface ProfileLeaderboardTableProps {
	items: Item[];
}

export default function ProfileLeaderboardTable(
	props: ProfileLeaderboardTableProps
) {
	const { items } = props;
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "played",
		direction: "descending",
	});

	const sortedItems = useMemo(() => {
		return [...items].sort((a: Item, b: Item) => {
			let cmp = 0;

			switch (sortDescriptor.column) {
				case "name":
					cmp = a.name.localeCompare(b.name);
					break;
				case "played":
					cmp = a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
					break;
				case "wins":
					cmp = a.wins > b.wins ? 1 : a.wins === b.wins ? 0 : -1;
					break;
				default:
					break;
			}

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const renderCell = (
		item: {
			name: string;
			played: number;
			wins: number;
		},
		columnKey: Key
	) => {
		switch (columnKey) {
			case "name":
				return item.name;
			case "played":
				return item.played.toString();
			case "wins":
				return `${item.wins.toString()} (${Math.round((item.wins / item.played) * 100).toString()}%)`;
		}
	};

	return (
		<Table sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
			<TableHeader>
				<TableColumn key="name" allowsSorting align="center">
					NAME
				</TableColumn>
				<TableColumn key="played" allowsSorting align="center">
					PLAYED
				</TableColumn>
				<TableColumn key="wins" allowsSorting align="center">
					WINS
				</TableColumn>
			</TableHeader>
			<TableBody items={sortedItems}>
				{(item: { name: string; played: number; wins: number }) => (
					<TableRow key={item.name}>
						{(columnKey: Key) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
