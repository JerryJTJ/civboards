import * as z from "zod";

export const GameStateSchema = z.object({
	name: z.string(),
	map: z.string(),
	mapSize: z.string(),
	speed: z.string(),
	turns: z.coerce.number(),
	winnerPlayer: z.string(),
	winnerLeaderId: z.coerce.number(),
	winnerCivilizationId: z.coerce.number(),
	isFinished: z.boolean(),
	victoryId: z.coerce.number(),
});

export const PlayerSchema = z.object({
	leaderId: z.coerce.number(),
	civilizationId: z.coerce.number(),
	name: z.string(),
	isHuman: z.boolean(),
});

export const InsertGameSchema = z.object({
	gameState: GameStateSchema,
	players: z.array(PlayerSchema),
	expansions: z.array(z.number()).max(2),
	gamemodes: z.array(z.number()),
});
