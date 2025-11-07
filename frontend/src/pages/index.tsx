import TitleCard from "@/components/TitleCard";
import DefaultLayout from "@/layouts/default";

const titleCards = [
	{
		title: "games",
		path: "/games",
		imgSrc: "https://i.imgur.com/2UqOEy9.jpeg",
	},
	{
		title: "leaderboard",
		path: "/leaderboard",
		imgSrc: "https://i.imgur.com/VGbEbqb.jpeg",
	},
];

export default function IndexPage() {
	return (
		<DefaultLayout>
			<section className="flex w-auto flex-row justify-self-center gap-4 h-[75vh] py-8 md:py-10 md:gap-10 lg:h-[85vh] lg:w-[55vw]">
				<>
					{titleCards.map((titleCard) => (
						<TitleCard key={titleCard.title} {...titleCard} />
					))}
				</>
			</section>
		</DefaultLayout>
	);
}
