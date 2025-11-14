import * as z from "zod";

import { GameForm } from "@interfaces/game.interface";

export type ValidateFormResult =
	| { success: false; message: string }
	| {
			success: true;
			result: z.ZodSafeParseSuccess<Record<string, unknown>>;
	  };

export function validateFormFields(
	form: GameForm,
	schema: z.ZodObject,
	gameId?: string
): ValidateFormResult {
	// Unique player names & >= 2 humans
	const names = new Set<string>();
	let humans = 0;

	form.players.forEach((player) => {
		if (player.isHuman) {
			names.add(player.name);
			humans++;
		}
	});
	if (humans < 2)
		return { success: false, message: "Need 2 or more human players" };
	if (names.size !== humans)
		return {
			success: false,
			message: "Can't have duplicate player names",
		};

	const winner = form.players.find((player) => player.id === form.winner);

	if (!winner && form.finished)
		return { success: false, message: "Can't find winner" };

	const result = schema.safeParse({
		id: gameId,
		finished: form.finished,
		createdBy: form.createdBy,
		date: form.date ? new Date(form.date).toISOString() : undefined,
		name: form.name,
		map: form.map,
		mapSize: form.mapSize,
		speed: form.speed,
		turns: form.turns,
		winnerPlayer: winner?.name,
		winnerLeaderId: winner?.leaderId,
		victoryId: form.victoryId,
		players: form.players,
		expansions: Array.from(form.expansions),
		gamemodes: Array.from(form.gamemodes),
	});

	if (!result.success) {
		return {
			success: false,
			message: "Failed to pass schema",
		};
	}

	return { success: true, result: result };
}
