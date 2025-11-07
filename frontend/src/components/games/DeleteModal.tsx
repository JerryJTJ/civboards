import { DisplayGameSchemaArray } from "@civboards/schemas";
import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import {
	QueryObserverResult,
	RefetchOptions,
	useMutation,
} from "@tanstack/react-query";
import { JSX, useState } from "react";
import * as z from "zod";

import { useGamesAPI } from "@/api/games";

interface DeleteModalProps {
	gameId: string;
	body: JSX.Element;
	isOpen: boolean;
	onOpenChange: () => void;
	refetch: (
		options?: RefetchOptions
	) => Promise<
		QueryObserverResult<z.infer<typeof DisplayGameSchemaArray> | undefined>
	>;
}

export default function DeleteModal(props: DeleteModalProps) {
	const { gameId, onOpenChange, body, isOpen, refetch } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const { deleteGameById } = useGamesAPI();

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
			addToast({
				title: "Success",
				color: "success",
				description: "Successfully deleted game",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		},
		onSettled: async () => {
			setLoading(false);
			await refetch();
		},
	});

	return (
		<Modal isDismissable isOpen={isOpen} onClose={onOpenChange}>
			<ModalContent>
				<ModalHeader>Confirm Deletion</ModalHeader>
				<ModalBody>{body}</ModalBody>
				<ModalFooter>
					<Button onPress={onOpenChange}>Cancel</Button>
					<Button
						color="danger"
						isLoading={loading}
						onPress={() => {
							setLoading(true);
							mutation
								.mutateAsync(gameId)
								.then(onOpenChange)
								.catch(() => {
									addToast({
										title: "Error",
										color: "warning",
										description: "Failed to delete game",
										timeout: 3000,
										shouldShowTimeoutProgress: true,
									});
								});
						}}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
