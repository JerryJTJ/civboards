import TitleCard from "@/components/TitleCard";
import DefaultLayout from "@/layouts/default";
import atlas from "/atlas.webp";
import discobolus from "/discobolus.webp";

const titleCards = [
	{
		title: "games",
		path: "/games",
		imgSrc: discobolus,
	},
	{
		title: "leaderboard",
		path: "/leaderboard",
		imgSrc: atlas,
	},
];

export default function IndexPage() {
	return (
		<DefaultLayout>
			<section className="flex w-auto flex-row justify-self-center gap-4 h-[75vh] py-8 md:py-10 md:gap-10 xl:h-[85vh] xl:w-[55vw]">
				<>
					{titleCards.map((titleCard) => (
						<TitleCard key={titleCard.title} {...titleCard} />
					))}
				</>
			</section>
		</DefaultLayout>
	);
}
