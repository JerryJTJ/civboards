import * as z from "zod";

// The coerces are used for the req.body objects
export const PlayerSchema = z
	.object({
		leaderId: z.coerce.number(),
		name: z.string(),
		isHuman: z.literal(true),
	})
	.or(
		z.object({
			leaderId: z.coerce.number(),
			isHuman: z.literal(false),
		})
	);

export const InsertGameSchema = z
	.object({
		finished: z.boolean(),
		name: z.string(),
		date: z.string().optional(),
		map: z.string(),
		mapSize: z.string(),
		speed: z.string(),
		turns: z.coerce.number().int(),
		winnerPlayer: z.string().optional(),
		winnerLeaderId: z.coerce.number().int().optional(),
		victoryId: z.coerce.number().int().gte(1).lte(6).optional(),
		players: z.array(PlayerSchema).min(2).max(20),
		expansions: z.array(z.int().gte(1).lte(2)).max(2).optional(),
		gamemodes: z.array(z.int().gte(1).lte(8)).max(8).optional(),
	})
	.refine((input) => {
		if (
			input.finished &&
			(input.winnerPlayer === undefined ||
				input.winnerLeaderId === undefined ||
				input.victoryId === undefined)
		) {
			return false;
		}
		return true;
	});

export const DisplayGameSchema = z.object({
	...InsertGameSchema.shape,
	id: z.number(),
	date: z.string(),
	isFinished: z.any().optional(),
	winnerCivilizationId: z.number().optional(),
});

export const DisplayGameSchemaArray = z.array(DisplayGameSchema);

export const ParseSaveSchema = z.object({
	speed: z.string(),
	turns: z.int(),
	map: z.string(),
	mapSize: z.string(),
	players: z.array(PlayerSchema).min(2).max(20),
	expansions: z.array(z.int().gte(1).lte(2)).max(2).optional(),
});
