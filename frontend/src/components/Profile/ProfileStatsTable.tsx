import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table";
import { useMemo } from "react";

interface ProfileStatsTableProps {
	played: number;
	won: number;
}

export default function ProfileStatsTable(props: ProfileStatsTableProps) {
	const { played, won } = props;

	const percentageWon = useMemo(() => {
		return Math.round((won / played) * 100);
	}, [won, played]);

	return (
		<Table aria-label="Profile Stats Table">
			<TableHeader>
				<TableColumn align="center">GAMES</TableColumn>
				<TableColumn align="center">NUMBER</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow key="games-played">
					<TableCell>Played</TableCell>
					<TableCell>{played}</TableCell>
				</TableRow>
				<TableRow key="games-won">
					<TableCell>Won</TableCell>
					<TableCell>
						{won} ({percentageWon}%)
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
