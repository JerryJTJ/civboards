import React from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import {
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
} from "@heroui/dropdown";
import type { SVGProps } from "react";
import { SortDescriptor } from "@react-types/shared";
import { SearchIcon, VerticalDotsIcon } from "./icons";

interface GamesTableProps {
	games: Array<{
		uuid: string;
		name: string;
		date: string;
		map: string;
		players: Array<string>;
		winner: string;
	}>;
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export function capitalize(s: string) {
	return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
	{ name: "NAME", key: "name", sortable: true },
	{ name: "DATE", key: "date", sortable: true },
	{ name: "MAP", key: "map", sortable: true },
	{ name: "PLAYERS", key: "players", sortable: false },
	{ name: "WINNER", key: "winner", sortable: true },
	{ name: "ACTIONS", key: "actions" },
];

export default function GamesTable(props: GamesTableProps) {
	const { games } = props;
	type Game = (typeof games)[0];

	const [filterValue, setFilterValue] = React.useState("");
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: "date",
		direction: "descending",
	});

	const [page, setPage] = React.useState(1);

	const hasSearchFilter = Boolean(filterValue);

	const sortedItems = React.useMemo(() => {
		return [...games].sort((a: Game, b: Game) => {
			let cmp: number = 0;

			switch (sortDescriptor.column) {
				case "name":
					cmp = a.name.localeCompare(b.name);
					break;
				case "date":
					cmp = a.date > b.date ? 1 : a.date === b.date ? 0 : -1;
					break;
				case "map":
					cmp = a.map.localeCompare(b.map);
					break;
				case "winner":
					cmp = a.winner.localeCompare(b.winner);
					break;
				default:
					break;
			}

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, games]);

	const filteredItems = React.useMemo(() => {
		let filteredGames = [...sortedItems];

		if (hasSearchFilter) {
			filteredGames = filteredGames.filter(
				(game) =>
					game.name
						.toLowerCase()
						.includes(filterValue.toLowerCase()) ||
					game.map
						.toLowerCase()
						.includes(filterValue.toLowerCase()) ||
					game.winner
						.toLowerCase()
						.includes(filterValue.toLowerCase()) ||
					game.date.toLowerCase().includes(filterValue.toLowerCase())
			);
		}

		return filteredGames;
	}, [sortedItems, filterValue]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const renderCell = React.useCallback((game: Game, columnKey: React.Key) => {
		const cellValue = game[columnKey as keyof Game];

		switch (columnKey) {
			case "name":
				return <p className="text-bold text-small">{game.name}</p>;
			case "date":
				return (
					<p className="text-bold text-small">
						{new Date(game.date).toLocaleDateString()}
					</p>
				);
			case "map":
				return <p className="text-bold text-small">{game.map}</p>;
			case "players":
				return (
					<p className="text-bold text-small">
						{" "}
						{game.players.join(", ")}
					</p>
				);
			case "actions":
				return (
					<div className="relative flex items-center justify-end gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<VerticalDotsIcon className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem key="view">View</DropdownItem>
								<DropdownItem key="edit">Edit</DropdownItem>
								<DropdownItem key="delete">Delete</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

	const onNextPage = React.useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = React.useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

	const onSearchChange = React.useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = React.useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const headerText = React.useMemo(() => {
		const prefix = filterValue ? "Filtered" : "Total";
		const suffix = filteredItems.length === 1 ? "" : "s";

		return `${prefix} ${filteredItems.length} game${suffix}`;
	}, [filterValue]);

	const topContent = React.useMemo(() => {
		return (
			<div className="flex flex-col h-full gap-4">
				<div className="flex items-end justify-between gap-3 ">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Search"
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						{/* <Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat"
								>
									Columns
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem
										key={column.uid}
										className="capitalize"
									>
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown> */}
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-default-700 text-small">
						{headerText}
					</span>
					<label className="flex items-center text-default-700 text-small">
						Rows per page:&nbsp;
						<select
							className="bg-transparent outline-none text-default-700 text-small"
							onChange={onRowsPerPageChange}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [
		filterValue,
		onSearchChange,
		onRowsPerPageChange,
		games.length,
		hasSearchFilter,
	]);

	const bottomContent = React.useMemo(() => {
		return (
			<div className="flex items-center justify-between px-2 py-2">
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onPreviousPage}
					>
						Previous
					</Button>
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onNextPage}
					>
						Next
					</Button>
				</div>
			</div>
		);
	}, [items.length, page, pages, hasSearchFilter]);

	return (
		<Table
			isHeaderSticky
			aria-label="Table of games"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			classNames={{
				wrapper: "max-h-[382px] lg:max-h-[50vh]",
			}}
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn
						key={column.key}
						align={column.key === "actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={"No users found"} items={items}>
				{(item) => (
					<TableRow key={item.uuid}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
