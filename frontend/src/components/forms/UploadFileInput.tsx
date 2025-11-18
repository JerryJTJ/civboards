import { AxiosError } from "axios";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";

import { GameForm } from "@interfaces/game.interface";
import { useParseAPI } from "@api/parse";

interface UploadFileInputProps {
	dispatch: (parsed: Partial<GameForm>) => void;
	// reset: (form: GameOptions) => void;
}

export default function UploadFileInput(props: UploadFileInputProps) {
	const { dispatch } = props;
	const { parseSaveFile } = useParseAPI();

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
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files) {
					void mutation.mutateAsync(e.target.files[0]);
				}
			}}
		/>
	);
}
