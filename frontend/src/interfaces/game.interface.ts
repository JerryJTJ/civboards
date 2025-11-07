export interface Civ {
	id: string;
	name: string;
	leaderId: number | undefined;
	isHuman: boolean;
}

export interface GameForm {
	name: string;
	createdBy: string;
	date: number | undefined;
	finished: boolean;
	speed: string;
	map: string;
	mapSize: string;
	turns: number;
	winner: string;
	victoryId: number | undefined;
	expansions: Set<number>;
	gamemodes: Set<number>;
	players: Civ[];
}
