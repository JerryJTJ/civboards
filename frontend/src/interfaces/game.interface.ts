import { Key } from "react";

export interface Civ {
	key: Key;
	name: string;
	leaderId: number | undefined;
	isHuman: boolean;
}

export interface GameOptions {
	name: string;
	finished: boolean;
	speed: string;
	map: string;
	mapSize: string;
	turns: number;
	winner: string;
	victoryId: number | undefined;
	expansions: Set<number>;
	gamemodes: Set<number>;
	players: Array<Civ>;
}
