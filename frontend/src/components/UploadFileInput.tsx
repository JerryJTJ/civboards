import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";

import { GameOptions } from "@/interfaces/game.interface";
import { parseSaveFile } from "@/api/parse";
import { AxiosError } from "axios";

interface UploadFileInputProps {
	dispatch: (parsed: Partial<GameOptions>) => void;
	// reset: (form: GameOptions) => void;
}

export default function UploadFileInput(props: UploadFileInputProps) {
	const { dispatch } = props;

	const mutation = useMutation({
		mutationFn: parseSaveFile,
		onError: (err: AxiosError) => {
			addToast({
				title: "Failed to parse file",
				color: "warning",
				description: err.message,
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		},
		onSuccess: (data) => {
			if (data.success) dispatch(data.data);
		},
	});

	return (
		<Input
			isClearable
			accept=".Civ6Save"
			className="self-center max-w-[400px]"
			isDisabled={mutation.isPending}
			label="Upload Save File"
			labelPlacement="inside"
			size="md"
			type="file"
			onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files) {
					await mutation.mutateAsync(e.target.files[0]);
				}
			}}
			// onClear={() => {
			// 	reset();
			// }}
		/>
	);
}
