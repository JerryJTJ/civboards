import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";

import { PlusIcon } from "../icons";
import GameModal from "../GameModal";

export default function AddGameModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Button
				className="border justify-self-end border-white/20"
				color="primary"
				endContent={<PlusIcon />}
				variant="shadow"
				onPress={onOpen}
			>
				Add Game
			</Button>
			<GameModal
				isOpen={isOpen}
				mode="add"
				onOpenChange={onOpenChange}
			 />
		</>
	);
}
