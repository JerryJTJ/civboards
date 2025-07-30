interface Gamestate {
	name: string;
	map: string;
	mapSize: string;
	speed: string;
	turns: number;
	winnerPlayer: string;
	winnerLeaderId: number;
	winnerCivilizationId: number;
	isFinished: boolean;
	victoryId: number;
}

export interface Player {
	leaderId: number;
	civilizationId: number;
	name: string;
	isHuman: boolean;
}

export interface InsertGame {
	gameState: Gamestate;
	players: Array<Player>;
	expansions: Array<number>;
	gamemodes: Array<number>;
}
