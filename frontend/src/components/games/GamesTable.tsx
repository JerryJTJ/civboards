import * as z from "zod";
import { Button } from "@heroui/button";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { DisplayGameSchema, DisplayGameSchemaArray } from "@civboards/schemas";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { SharedSelection } from "@heroui/system";
import { SortDescriptor } from "@react-types/shared";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";

import {
	ChevronDownIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@components/icons";
import EditGameModal from "@components/forms/EditGameModal";

import DeleteModal from "./DeleteModal";
import GamesOptionDropdown from "./GamesOptionDropdown";

import { DEFAULT_DISPLAY_GAME } from "@constants/gameDefaults";
import { capitalize } from "@utils/capitalize";
import useWindowDimensions from "@hooks/useWindowDimensions";

interface GamesTableProps {
	games: z.infer<typeof DisplayGameSchemaArray>;
}

const columns = [
	{ name: "NAME", key: "name", sortable: true },
	{ name: "DATE", key: "date", sortable: true },
	{ name: "SPEED", key: "speed", sortable: true },
	{ name: "MAP", key: "map", sortable: true },
	{ name: "SIZE", key: "size", sortable: true },
	{ name: "TURNS", key: "turns", sortable: true },
	{ name: "PLAYERS", key: "players", sortable: false },
	{ name: "WINNER", key: "winner", sortable: true },
	{ name: "FINISHED", key: "finished", sortable: true },
	{ name: "ACTIONS", key: "actions" },
];

const DEFAULT_COLUMNS = ["name", "date", "map", "players", "winner", "actions"];
const MOBILE_COLUMNS = ["name", "date", "players"];

export default function GamesTable(props: GamesTableProps) {
	const { games } = props;
	const { width } = useWindowDimensions();

	// Modal
	const editModal = useDisclosure();
	const deleteModal = useDisclosure();

	const [currGame, setCurrGame] =
		useState<z.infer<typeof DisplayGameSchema>>(DEFAULT_DISPLAY_GAME);

	type Game = z.infer<typeof DisplayGameSchema>;

	// Visible Columns
	const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(
		width > 640 ? new Set(DEFAULT_COLUMNS) : new Set(MOBILE_COLUMNS)
	);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.key)
		);
	}, [visibleColumns]);

	// Table Logic
	const [filterValue, setFilterValue] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "date",
		direction: "descending",
	});

	const [page, setPage] = useState(1);

	const hasSearchFilter = Boolean(filterValue);

	const sortedItems = useMemo(() => {
		if (games.length === 0) return games;

		return [...games].sort((a: Game, b: Game) => {
			let cmp = 0;

			switch (sortDescriptor.column) {
				case "name":
					cmp = a.name.localeCompare(b.name);
					break;
				case "date": {
					const aDate = new Date(a.date);
					const bDate = new Date(b.date);

					cmp = aDate > bDate ? 1 : aDate === bDate ? 0 : -1;
					break;
				}
				case "map":
					cmp = a.map.localeCompare(b.map);
					break;
				case "size":
					cmp = a.mapSize.localeCompare(b.mapSize);
					break;
				case "finished":
					cmp =
						Number(a.finished) > Number(b.finished)
							? 1
							: Number(a.finished) === Number(b.finished)
								? 0
								: -1;
					break;
				case "speed":
					cmp = a.speed.localeCompare(b.speed);
					break;
				case "turns":
					cmp = a.turns > b.turns ? 1 : a.turns === b.turns ? 0 : -1;
					break;
				case "winner":
					cmp = (a.winnerPlayer ?? "").localeCompare(b.winnerPlayer ?? "");
					break;
				default:
					break;
			}

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, games]);

	const filteredItems = useMemo(() => {
		if (games.length === 0) return games;
		let filteredGames = [...sortedItems];

		if (hasSearchFilter) {
			filteredGames = filteredGames.filter(
				(game) =>
					game.name.toLowerCase().includes(filterValue.toLowerCase()) ||
					game.map.toLowerCase().includes(filterValue.toLowerCase()) ||
					(game.winnerPlayer ?? "")
						.toLowerCase()
						.includes(filterValue.toLowerCase()) ||
					new Date(game.date)
						.toLocaleDateString()
						.toLowerCase()
						.includes(filterValue.toLowerCase())
			);
		}

		return filteredGames;
	}, [sortedItems, filterValue, hasSearchFilter, games]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const renderCell = useCallback(
		(game: Game, columnKey: Key) => {
			// const cellValue = game[columnKey as keyof Game];

			switch (columnKey) {
				case "name":
					return (
						<p className="text-xs sm:text-bold sm:text-small">{game.name}</p>
					);
				case "date":
					return (
						<p className="text-xs sm:text-bold sm:text-small">
							{new Date(game.date).toLocaleDateString()}
						</p>
					);
				case "map":
					return (
						<p className="text-xs sm:text-bold sm:text-small">{game.map}</p>
					);
				case "players": {
					const humans: string[] = [];

					game.players.forEach((player) => {
						if (player.isHuman) humans.push(capitalize(player.name));
					});

					return (
						<p className="text-xs sm:text-bold sm:text-small">
							{humans.join(", ")}
						</p>
					);
				}
				case "winner":
					return (
						<p className="text-xs sm:text-bold sm:text-small">
							{capitalize(game.winnerPlayer ?? "")}
						</p>
					);
				case "finished":
					return (
						<p className="text-xs text-center sm:text-bold sm:text-small">
							{game.finished ? "✔️" : ""}
						</p>
					);
				case "size":
					return (
						<p className="text-xs sm:text-bold sm:text-small">
							{capitalize(game.mapSize)}
						</p>
					);
				case "speed":
					return (
						<p className="text-xs sm:text-bold sm:text-small">
							{capitalize(game.speed)}
						</p>
					);
				case "turns":
					return (
						<p className="text-xs sm:text-bold sm:text-small">{game.turns}</p>
					);
				case "actions":
					return (
						<div className="relative flex items-center justify-end gap-2">
							<Dropdown
								classNames={{
									base: "border-fg rounded-2xl",
								}}
							>
								<DropdownTrigger>
									<Button isIconOnly size="sm" variant="light">
										<VerticalDotsIcon className="text-default-300" />
									</Button>
								</DropdownTrigger>
								<GamesOptionDropdown
									game={game}
									setCurrGame={setCurrGame}
									onOpenDelete={deleteModal.onOpen}
									onOpenEdit={editModal.onOpen}
								/>
							</Dropdown>
						</div>
					);
				default:
				// return <p>{cellValue?.toString()}</p>;
			}
		},
		[deleteModal, editModal]
	);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const headerText = useMemo(() => {
		const prefix = filterValue ? "Filtered" : "Total";
		const suffix = filteredItems.length === 1 ? "" : "s";

		return `${prefix} ${filteredItems.length.toString()} game${suffix}`;
	}, [filterValue, filteredItems.length]);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col h-full gap-4">
				<div className="flex items-end justify-between gap-3 ">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						classNames={{
							base: "border-fg rounded-xl",
						}}
						placeholder="Search"
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => {
							onClear();
						}}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						{/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
						<Dropdown
							classNames={{
								base: "border-fg rounded-2xl",
							}}
						>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									className="border-fg justify-self-end"
									endContent={<ChevronDownIcon className="text-small" />}
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
									<DropdownItem key={column.key} className="capitalize">
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-default-700 text-small">{headerText}</span>
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
		headerText,
		visibleColumns,
		onClear,
	]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-between px-2 py-2">
				<Pagination
					isCompact
					showControls
					showShadow
					classNames={{
						wrapper: "border-fg",
						cursor: "border-fg",
					}}
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button
						className="border-fg justify-self-end "
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onPreviousPage}
					>
						Previous
					</Button>
					<Button
						className="border-fg justify-self-end "
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
		<>
			<Table
				isHeaderSticky
				aria-label="Table of games"
				bottomContent={bottomContent}
				bottomContentPlacement="outside"
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSortChange={setSortDescriptor}
			>
				<TableHeader columns={headerColumns}>
					{(column) => (
						<TableColumn
							key={column.key}
							align={
								column.key === "actions" || column.key === "finished"
									? "center"
									: "start"
							}
							allowsSorting={column.sortable}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody emptyContent={"No games found"} items={items}>
					{(item) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>{renderCell(item, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
			{/* Modals */}
			<EditGameModal
				key={`${currGame.id}-edit`}
				disclosure={editModal}
				game={currGame}
			/>
			<DeleteModal
				key={`${currGame.id}-delete`}
				gameId={currGame.id}
				isOpen={deleteModal.isOpen}
				name={currGame.name}
				onOpenChange={deleteModal.onOpenChange}
			/>
		</>
	);
}
