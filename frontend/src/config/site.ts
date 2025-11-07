export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "CivBoards",
	content: "A Civilization 6 leaderboard.",
	navItems: [
		// {
		// 	label: "Home",
		// 	href: "/",
		// },
		{
			label: "Games",
			href: "/games",
		},
		{
			label: "Leaderboard",
			href: "/leaderboard",
		},
	],
	navMenuItems: [
		// {
		// 	label: "Home",
		// 	href: "/",
		// },
		{
			label: "Games",
			href: "/games",
		},
		{
			label: "Leaderboard",
			href: "/leaderboard",
		},
	],

	links: {
		github: "https://github.com/JerryJTJ/civboards",
	},
};
