import { Key } from "react";

export interface Civ {
	key: Key;
	playerName: string;
	civilizationName: string;
	isHuman: boolean;
}

export interface GameOptions {
	name: string;
	speed: string;
	map: string;
	mapSize: string;
	turns: number;
	winner: string;
	victory: string;
	expansions: Set<number>;
	gamemodes: Set<number>;
	players: Array<Civ>;
}
