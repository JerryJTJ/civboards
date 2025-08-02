export const MAP_SIZE = [
	{
		key: "duel",
		size: "Duel",
		players: {
			default: 2,
			max: 4,
		},
	},
	{
		key: "tiny",
		size: "Tiny",
		players: {
			default: 4,
			max: 6,
		},
	},
	{
		key: "small",
		size: "Small",
		players: {
			default: 6,
			max: 10,
		},
	},
	{
		key: "standard",
		size: "Standard",
		players: {
			default: 8,
			max: 14,
		},
	},
	{
		key: "large",
		size: "Large",
		players: {
			default: 10,
			max: 16,
		},
	},
	{
		key: "huge",
		size: "Huge",
		players: {
			default: 12,
			max: 20,
		},
	},
];

export const GAME_SPEED = [
	{ key: "online", label: "Online" },
	{ key: "quick", label: "Quick" },
	{ key: "standard", label: "Standard" },
	{ key: "epic", label: "Epic" },
	{ key: "marathon", label: "Marathon" },
];

export const VICTORY_TYPES = [
	{ key: "science", label: "Science", id: 1 },
	{ key: "culture", label: "Culture", id: 2 },
	{ key: "domination", label: "Domination", id: 3 },
	{ key: "religion", label: "Religion", id: 4 },
	{ key: "diplomatic", label: "Diplomatic", id: 5 },
	{ key: "score", label: "Score", id: 6 },
];
