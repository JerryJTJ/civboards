import { parseSaveFile } from "@/api/parse";
import { GameOptions } from "@/interfaces/game.interface";
import { Input } from "@heroui/input";
import { useState } from "react";
import { addToast } from "@heroui/toast";

interface UploadFileInputProps {
	dispatch: (parsed: Partial<GameOptions>) => void;
}

type Loading = "Idle" | "Parse" | "Success" | "Fail";

export default function UploadFileInput(props: UploadFileInputProps) {
	const { dispatch } = props;

	const [loading, setLoading] = useState<Loading>("Idle");

	return (
		<Input
			className="self-center max-w-[400px]"
			isDisabled={loading === "Parse"}
			// errorMessage={loading === "Idle" ? "Hello" : ""}
			size="md"
			type="file"
			accept=".Civ6Save"
			label="Upload Save File"
			labelPlacement="inside"
			onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files) {
					setLoading("Parse");
					try {
						const response = await parseSaveFile(e.target.files[0]);

						if (!response.success) throw new Error();
						dispatch(response.data);
						setLoading("Success");
					} catch (error) {
						addToast({
							title: "Error",
							color: "warning",
							description: "Could not parse file",
							timeout: 3000,
							shouldShowTimeoutProgress: true,
						});
						setLoading("Fail");
					}
				}
			}}
		/>
	);
}
