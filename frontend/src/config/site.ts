export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "CivBoards",
	content: "A Civilization 6 leaderboard.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
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
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Team",
			href: "/team",
		},
		{
			label: "Calendar",
			href: "/calendar",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/JerryJTJ/civboards",
	},
};
