import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";

import defeat from "/defeat.webp";

export default function NotFoundPage() {
	return (
		<DefaultLayout>
			<Card isFooterBlurred className="border border-white/20" shadow="sm">
				<CardHeader className="flex justify-center">
					<p className="font-semibold text-center text-large text-md">
						Page Not Found
					</p>
				</CardHeader>
				<Link href="/">
					<Image
						isBlurred
						isZoomed
						alt="Civ 6 Defeat Animation"
						className="z-0 object-cover w-full h-full"
						height={500}
						radius="lg"
						src={defeat}
						width={800}
					/>
				</Link>

				<CardFooter className="absolute bottom-0 z-10 flex items-center justify-center backdrop-blur-md ">
					<div className="flex flex-col">
						<p className="max-w-md font-serif text-sm italic text-center text-white ">
							&quot;From the dust to which our civilization first rose so too
							shall we return. As the light of our people fades to nothingness,
							we wonder if one will rise to rekindle our flame.&quot;
						</p>
					</div>
				</CardFooter>
			</Card>
		</DefaultLayout>
	);
}
