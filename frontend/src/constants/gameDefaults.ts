import { GameOptions } from "@/interfaces/game.interface";

export const DEFAULT_ADD_FORM: GameOptions = {
	finished: true,
	date: undefined,
	name: "",
	speed: "",
	map: "",
	mapSize: "standard",
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
