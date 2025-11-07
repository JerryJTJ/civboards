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
	finished: number;
	wins: number;
}

export default function ProfileStatsTable(props: ProfileStatsTableProps) {
	const { played, finished, wins } = props;

	const percentageWon = useMemo(() => {
		return Math.round((wins / finished) * 100);
	}, [wins, finished]);

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
				<TableRow key="games-finished">
					<TableCell>Finished</TableCell>
					<TableCell>{finished}</TableCell>
				</TableRow>
				<TableRow key="games-won">
					<TableCell>Wins</TableCell>
					<TableCell>
						{wins} ({percentageWon}%)
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
