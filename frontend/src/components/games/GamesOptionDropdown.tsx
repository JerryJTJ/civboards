import * as z from "zod";
import { DisplayGameSchema } from "@civboards/schemas";
import { DropdownItem, DropdownMenu } from "@heroui/dropdown";
import { Link } from "react-router-dom";
import { addToast } from "@heroui/toast";
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

	return (
		<DropdownMenu selectionMode="single" variant="shadow">
			<DropdownItem key="view">
				<Link className="block w-full h-full" to={`/game/${game.id}`}>
					View
				</Link>
			</DropdownItem>
			{isAuthenticated ? (
				<>
					<DropdownItem
						key="edit"
						onPress={() => {
							if (game.createdBy !== user?.username) {
								addToast({
									title: "Error",
									color: "warning",
									description: "You may only modify games you created",
									timeout: 3000,
									shouldShowTimeoutProgress: true,
								});
								
								return;
							}
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
							if (game.createdBy !== user?.username) {
								addToast({
									title: "Error",
									color: "warning",
									description: "You may only modify games you created",
									timeout: 3000,
									shouldShowTimeoutProgress: true,
								});

								return;
							}
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
