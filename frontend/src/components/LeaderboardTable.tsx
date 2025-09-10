import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	SortDescriptor,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import React, { useMemo } from "react";
import { Link } from "@heroui/link";

import { SearchIcon } from "./icons";

import { LeaderboardView } from "@/pages/LeaderboardPage";
import { capitalize } from "@/utils/capitalize";

const columns: Array<{ key: string; name: string; sortable: boolean }> = [
	{
		key: "player",
		name: "PLAYER",
		sortable: true,
	},
	{
		key: "leader",
		name: "LEADER",
		sortable: true,
	},
	{
		key: "civilization",
		name: "CIVILIZATION",
		sortable: true,
	},
	{
		key: "victory",
		name: "VICTORY",
		sortable: true,
	},
	{
		key: "wins",
		name: "WINS",
		sortable: true,
	},
];

type LeaderboardEntry = { label: string; wins: number };

interface LeaderboardProps {
	view: LeaderboardView;
	leaderboardData: Array<LeaderboardEntry>;
}

function getPodiumScores(entries: Array<{ label: string; wins: number }>) {
	//Function used to find the scores necessary for podium placement
	const scores = new Set<number>();

	for (const entry of entries) {
		if (entry.wins !== 0) scores.add(entry.wins);
	}

	const sortedScores = [...scores].sort().reverse();
	const medals = ["🥇", "🥈", "🥉"];

	const podium = new Map<number, string>();

	for (let i = 0; i < sortedScores.length && i < 3; i++) {
		podium.set(sortedScores[i], medals[i]);
	}

	return podium;
}

export default function LeaderboardTable(props: LeaderboardProps) {
	const { view, leaderboardData } = props;

	const podium = useMemo(() => {
		return getPodiumScores(leaderboardData);
	}, [leaderboardData]);

	const [filterValue, setFilterValue] = React.useState("");
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: "wins",
		direction: "descending",
	});

	const [page, setPage] = React.useState(1);

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = columns.filter(
		(column) => column.key === view || column.key === "wins"
	);

	//Filter -> Sort -> Paginate
	const sortedItems = React.useMemo(() => {
		return [...leaderboardData].sort(
			(a: LeaderboardEntry, b: LeaderboardEntry) => {
				let cmp: number = 0;

				switch (sortDescriptor.column) {
					case "player":
					case "leader":
					case "civilization":
					case "victory":
						cmp = a.label.localeCompare(b.label);
						break;
					case "wins":
						cmp = a.wins > b.wins ? 1 : a.wins === b.wins ? 0 : -1;
						break;
					default:
						break;
				}

				return sortDescriptor.direction === "descending" ? -cmp : cmp;
			}
		);
	}, [sortDescriptor, leaderboardData]);

	const filteredItems = React.useMemo(() => {
		let filtered = [...sortedItems];

		if (hasSearchFilter) {
			filtered = filtered.filter((entry) =>
				entry.label.toLowerCase().includes(filterValue.toLowerCase())
			);
		}

		return filtered;
	}, [sortedItems, filterValue, hasSearchFilter]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const renderCell = React.useCallback(
		(entry: LeaderboardEntry, columnKey: React.Key) => {
			const cellValue = entry[columnKey as keyof LeaderboardEntry];
			const medal = podium.get(entry.wins) ?? "";

			switch (columnKey) {
				case "player":
					return (
						<div className="flex justify-center w-auto">
							<Link isBlock href={`/profile/${entry.label}`}>
								<p className="text-base text-center text-bold text-default-foreground">
									{medal ? `${medal} ` : ""}
									{capitalize(entry.label)}
								</p>
							</Link>
						</div>
					);
				case "leader":
				case "civilization":
				case "victory":
					return (
						<p className="text-base text-center text-bold">
							{medal ? `${medal} ` : ""}
							{entry.label}
						</p>
					);
				case "wins":
					return (
						<p className="text-base text-center text-bold">
							{entry.wins}
						</p>
					);
				default:
					return cellValue;
			}
		},
		[podium]
	);

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
		const suffix = filteredItems.length === 1 ? "entry" : "entries";

		return `${prefix} ${filteredItems.length} ${suffix}`;
	}, [filterValue, filteredItems.length]);

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
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [filterValue, onSearchChange, onRowsPerPageChange, headerText, onClear]);

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
	}, [page, pages, onNextPage, onPreviousPage]);

	return (
		<Table
			isHeaderSticky
			aria-label="Table of games"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			className="self-center align-center"
			classNames={{
				wrapper: "max-h-[382px] lg:max-h-[60vh] self-center",
			}}
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.key}
						allowsSorting={column.sortable}
						className="text-center"
						width="50%"
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={"No finished games found"} items={items}>
				{(item) => (
					<TableRow key={item.label}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
