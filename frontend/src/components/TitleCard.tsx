import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { useNavigate } from "react-router-dom";

interface TitleCardProps {
	title: string;
	path: string;
	imgSrc: string;
}

export default function TitleCard(props: TitleCardProps) {
	const { title, path, imgSrc } = props;

	const navigate = useNavigate();

	return (
		<Card
			isFooterBlurred
			isHoverable
			isPressable
			className="flex items-center justify-center w-full h-full col-span-12 sm:col-span-7 border-white/20 border"
			shadow="sm"
			onPress={() => {
				navigate(path);
			}}
		>
			<CardFooter className="backdrop-blur-lg absolute z-10 flex-col items-center justify-center before:bg-white/20 border-white/20 border overflow-hidden py-1 before:rounded-xl rounded-large w-[calc(100%-12px)] xl:py-3">
				<h4 className="font-serif text-base tracking-widest text-center sm:text-2xl md:text-3xl text-foreground/90 2xl:text-5xl">
					{title.toUpperCase()}
				</h4>
			</CardFooter>
			<Image
				isZoomed
				removeWrapper
				className="z-0 object-cover w-full h-full scale-105"
				src={imgSrc}
			/>
		</Card>
	);
}

//bg-background/10", "backdrop-blur", "backdrop-saturate-150
