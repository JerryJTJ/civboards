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
			<section className="flex flex-row items-center gap-4 h-[75vh] py-8 h-9/10 justify-top md:py-10 md:gap-10 lg:h-[85vh] lg:w-[55vw]">
				<>
					{" "}
					{titleCards.map((titleCard) => (
						<TitleCard {...titleCard} />
					))}
				</>
			</section>
		</DefaultLayout>
	);
}
