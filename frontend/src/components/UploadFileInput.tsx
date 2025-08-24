import { parseSaveFile } from "@/api/parse";
import { GameOptions } from "@/interfaces/game.interface";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";

interface UploadFileInputProps {
	dispatch: (parsed: Partial<GameOptions>) => void;
	reset: () => void;
}

export default function UploadFileInput(props: UploadFileInputProps) {
	const { dispatch, reset } = props;

	const mutation = useMutation({
		mutationFn: parseSaveFile,
		onError: () => {
			addToast({
				title: "Error",
				color: "warning",
				description: "Could not parse file",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		},
		onSuccess: (data) => {
			dispatch(data.data);
		},
	});

	return (
		<Input
			className="self-center max-w-[400px]"
			isDisabled={mutation.isPending}
			isClearable
			size="md"
			type="file"
			accept=".Civ6Save"
			label="Upload Save File"
			labelPlacement="inside"
			onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files) {
					await mutation.mutateAsync(e.target.files[0]);
				}
			}}
			onClear={() => {
				reset();
			}}
		/>
	);
}
