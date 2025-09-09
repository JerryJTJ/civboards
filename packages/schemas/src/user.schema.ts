import * as z from "zod";

// This is for finished games only
export const ProfileSchema = z.object({
	username: z.string(),
	played: z.int(),
	won: z.int(),
	finished: z.int(),
	civs: z.array(
		z.object({ name: z.string(), played: z.int(), wins: z.int() })
	),
	leaders: z.array(
		z.object({ name: z.string(), played: z.int(), wins: z.int() })
	),
});
