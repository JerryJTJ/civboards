export interface MapSize {
	key: string;
	size: string;
	players: {
		default: number;
		max: number;
	};
}

export const MAP_SIZE: MapSize[] = [
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

export interface GameSpeed {
	key: string;
	label: string;
}

export const GAME_SPEED: GameSpeed[] = [
	{ key: "online", label: "Online" },
	{ key: "quick", label: "Quick" },
	{ key: "standard", label: "Standard" },
	{ key: "epic", label: "Epic" },
	{ key: "marathon", label: "Marathon" },
];

export interface Victory {
	id: number;
	label: string;
}
export const VICTORY_TYPES: Victory[] = [
	{ id: 1, label: "Science" },
	{ id: 2, label: "Culture" },
	{ id: 3, label: "Domination" },
	{ id: 4, label: "Religion" },
	{ id: 5, label: "Diplomatic" },
	{ id: 6, label: "Score" },
];

export interface Gamemode {
	id: number;
	label: string;
}

export const GAMEMODES: Gamemode[] = [
	{ id: 1, label: "Apocalypse" },
	{ id: 2, label: "Secret Societies" },
	{ id: 3, label: "Tech and Civic Shuffle" },
	{ id: 4, label: "Dramatic Ages" },
	{ id: 5, label: "Heroes & Legends" },
	{ id: 6, label: "Monopolies and Corporations" },
	{ id: 7, label: "Barbarian Clans" },
];

export interface Expansion {
	id: number;
	label: string;
}

export const EXPANSIONS = [
	{ id: 1, label: "Rise and Fall" },
	{ id: 2, label: "Gathering Storm" },
];
