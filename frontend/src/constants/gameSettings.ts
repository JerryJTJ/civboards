import { GameOptions } from "@/interfaces/game.interface";

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
	{ key: 1, label: "Science", id: 1 },
	{ key: 2, label: "Culture", id: 2 },
	{ key: 3, label: "Domination", id: 3 },
	{ key: 4, label: "Religion", id: 4 },
	{ key: 5, label: "Diplomatic", id: 5 },
	{ key: 6, label: "Score", id: 6 },
];

export const GAMEMODES = [
	{ id: 1, label: "Apocalypse" },
	{ id: 2, label: "Secret Societies" },
	{ id: 3, label: "Tech and Civic Shuffle" },
	{ id: 4, label: "Dramatic Ages" },
	{ id: 5, label: "Heroes & Legends" },
	{ id: 6, label: "Monopolies and Corporations" },
	{ id: 7, label: "Barbarian Clans" },
];

export const EXPANSIONS = [
	{ id: 1, label: "Rise and Fall" },
	{ id: 2, label: "Gathering Storm" },
];

export const DEFAULT_ADD_FORM: GameOptions = {
	name: "",
	speed: "",
	map: "",
	mapSize: "",
	turns: 0,
	winner: "",
	victoryId: undefined,
	expansions: new Set<number>(),
	gamemodes: new Set<number>(),
	players: [
		{
			key: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			key: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
	],
};
