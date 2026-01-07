import * as z from "zod";
import { DisplayGameSchema } from "@civboards/schemas";
import { DropdownItem, DropdownMenu } from "@heroui/dropdown";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface GamesOptionDropdownProps {
	onOpenEdit: () => void;
	onOpenDelete: () => void;
	game: z.infer<typeof DisplayGameSchema>;
	setCurrGame: React.Dispatch<
		React.SetStateAction<z.infer<typeof DisplayGameSchema>>
	>;
}

export default function GamesOptionDropdown(props: GamesOptionDropdownProps) {
	const { onOpenEdit, onOpenDelete, game, setCurrGame } = props;

	const { user, isAuthenticated } = useAuth0();

	const isCreatedByUser = game.createdBy === user?.username;

	return (
		<DropdownMenu selectionMode="single" variant="flat">
			<DropdownItem key="view" textValue="View">
				<Link className="block w-full h-full" to={`/game/${game.id}`}>
					View
				</Link>
			</DropdownItem>
			{isAuthenticated && isCreatedByUser ? (
				<>
					<DropdownItem
						key="edit"
						onPress={() => {
							setCurrGame(game);
							onOpenEdit();
						}}
					>
						Edit
					</DropdownItem>
					<DropdownItem
						key="delete"
						color="danger"
						onPress={() => {
							setCurrGame(game);
							onOpenDelete();
						}}
					>
						Delete
					</DropdownItem>
				</>
			) : null}
		</DropdownMenu>
	);
}
