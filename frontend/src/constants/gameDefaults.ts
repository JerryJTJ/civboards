import * as z from "zod";
import { DisplayGameSchema } from "@civboards/schemas";

import { GameForm } from "@interfaces/game.interface";

export const DEFAULT_ADD_FORM: GameForm = {
	finished: true,
	createdBy: "",
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
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
		{
			id: crypto.randomUUID(),
			name: "",
			leaderId: undefined,
			isHuman: true,
		},
	],
};

export const DEFAULT_DISPLAY_GAME: z.infer<typeof DisplayGameSchema> = {
	id: "",
	createdBy: "",
	date: "",
	players: [],
	finished: false,
	name: "",
	map: "",
	mapSize: "",
	speed: "",
	turns: 0,
};
