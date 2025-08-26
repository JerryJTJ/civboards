import { Spinner } from "@heroui/spinner";

interface LoadingSpinnerProps {
	height: number;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
	const { height } = props;

	return <Spinner className={`pt-[${height}vh]`} />;
}
