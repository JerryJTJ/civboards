import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { useGamesAPI } from "@api/games";
import { useLocation, useNavigate } from "react-router-dom";

interface DeleteModalProps {
	gameId: string;
	name: string;
	isOpen: boolean;
	onOpenChange: () => void;
}

export default function DeleteModal(props: DeleteModalProps) {
	const { gameId, onOpenChange, name, isOpen } = props;
	const { deleteGameById } = useGamesAPI();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();

	// API
	const mutation = useMutation({
		mutationFn: deleteGameById,
		onError: () => {
			addToast({
				title: "Error",
				color: "warning",
				description: "Failed to delete game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		},
		onSuccess: () => {
			onOpenChange();
			addToast({
				title: "Success",
				color: "success",
				description: "Successfully deleted game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
			if (location.pathname !== "/games") navigate("/games");
		},
		onSettled: async () => {
			await queryClient.invalidateQueries();
		},
	});

	return (
		<Modal isDismissable isOpen={isOpen} onClose={onOpenChange}>
			<ModalContent>
				<ModalHeader>Confirm Deletion</ModalHeader>
				<ModalBody>
					{" "}
					<p>
						Are you sure you want to delete <b>{name}</b>?
					</p>
				</ModalBody>
				<ModalFooter>
					<Button onPress={onOpenChange}>Cancel</Button>
					<Button
						color="danger"
						isLoading={mutation.isPending}
						onPress={() => {
							void (async () => {
								await mutation.mutateAsync(gameId);
							})();
						}}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
