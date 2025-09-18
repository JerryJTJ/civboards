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
import { JSX } from "react";
import * as z from "zod";

import { useGamesAPI } from "@/api/games";

interface DeleteModalProps {
	gameId: string;
	body: JSX.Element;
	isOpen: boolean;
	onOpenChange: () => void;
	refetch: (
		options?: RefetchOptions | undefined
	) => Promise<
		QueryObserverResult<
			z.infer<typeof DisplayGameSchemaArray> | undefined,
			Error
		>
	>;
}

export default function DeleteModal(props: DeleteModalProps) {
	const { gameId, onOpenChange, body, isOpen, refetch } = props;
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
		onSettled: () => {
			refetch();
		},
	});

	return (
		<Modal isOpen={isOpen}>
			<ModalContent>
				<ModalHeader>Confirmation Deletion</ModalHeader>
				<ModalBody>{body}</ModalBody>
				<ModalFooter>
					<Button onPress={onOpenChange}>Cancel</Button>
					<Button
						color="danger"
						onPress={async () => {
							await mutation.mutateAsync(gameId);
							onOpenChange();
						}}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
