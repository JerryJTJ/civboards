import * as z from "zod";

// The coerces are used for the req.body objects
export const PlayerSchema = z.object({
	leaderId: z.coerce.number(),
	name: z.string(),
	isHuman: z.boolean(),
});

export const InsertGameSchema = z.object({
	name: z.string(),
	map: z.string(),
	mapSize: z.string(),
	speed: z.string(),
	turns: z.coerce.number().int(),
	winnerPlayer: z.string(),
	winnerLeaderId: z.coerce.number().int(),
	victoryId: z.coerce.number().int().gte(1).lte(6),
	players: z.array(PlayerSchema).min(2).max(20),
	expansions: z.array(z.int().gte(1).lte(2)).max(2).optional(),
	gamemodes: z.array(z.int().gte(1).lte(7)).max(7).optional(),
});
