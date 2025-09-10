import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";

export default function NotFoundPage() {
	return (
		<DefaultLayout>
			<Card
				className="border border-white/20"
				shadow="sm"
				isFooterBlurred
			>
				<CardHeader className="flex justify-center">
					<p className="font-semibold text-center text-large text-md">
						Page Not Found
					</p>
				</CardHeader>
				<Link href="/">
					<Image
						radius="lg"
						isBlurred
						isZoomed
						alt="Civ 6 Defeat Animation"
						className="z-0 object-cover w-full h-full"
						height={500}
						src="https://imgur.com/HqPh7KY.png"
						width={800}
					/>
				</Link>

				<CardFooter className="absolute bottom-0 z-10 flex items-center justify-center backdrop-blur-md ">
					<div className="flex flex-col">
						<p className="max-w-md text-sm italic text-center text-white">
							"From the dust to which our civilization first rose
							so too shall we return. As the light of our people
							fades to nothingness, we wonder if one will rise to
							rekindle our flame."
						</p>
					</div>
				</CardFooter>
			</Card>
		</DefaultLayout>
	);
}
