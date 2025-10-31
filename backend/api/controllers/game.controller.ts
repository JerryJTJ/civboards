import {
	createGame,
	fetchAllGameVictoryIds,
	fetchAllGameWinnerCivilizationIds,
	fetchAllGameWinnerLeaderIds,
	fetchAllGameWinners,
	fetchAllGames,
	fetchAllGamesByPlayer,
	fetchGameById,
	fetchGamesByCreatedBy,
	softRemoveGameById,
	updateGame,
} from "../services/game.service";
import { NextFunction, Request, Response } from "express";
import { fetchGameGamemodesIdsByGameId } from "../services/gameGamemode.service";
import { fetchGameExpansionsIdsByGameId } from "../services/gameExpansion.service";
import { fetchGamePlayersByGameId } from "../services/gamePlayer.service";
import { ValidationError } from "../../types/Errors";
import {
	InsertGameSchema,
	UpdateGameSchema,
	DisplayGameSchema,
} from "@civboards/schemas";
import * as z from "zod";
import { Tables } from "../../interfaces/supabase";

// UTILS
async function exportGameObject(game: Tables<"game">) {
	const gameId = game.id;

	const [players, gamemodes, expansions] = await Promise.all([
		fetchGamePlayersByGameId(gameId),
		fetchGameGamemodesIdsByGameId(gameId),
		fetchGameExpansionsIdsByGameId(gameId),
	]);

	const gameObject = {
		id: game.id,
		createdBy: game.created_by,
		date: game.date,
		finished: game.finished,
		map: game.map,
		mapSize: game.map_size,
		name: game.name,
		speed: game.speed,
		turns: game.turns,
		victoryId: game.victory_id || undefined,
		winnerCivilizationId: game.winner_civilization_id || undefined,
		winnerLeaderId: game.winner_leader_id,
		winnerPlayer: game.winner_player,
		players: players,
		gamemodes: gamemodes,
		expansions: expansions,
	};

	const validate = DisplayGameSchema.safeParse(gameObject);

	if (validate.success) return validate.data;
	throw new ValidationError(JSON.stringify(z.treeifyError(validate.error)));
}

async function exportGameObjects(games: Array<Tables<"game">>) {
	const fullGames = await Promise.all(
		games.map(async (game) => exportGameObject(game))
	);

	fullGames.sort((a, b) => {
		return a.date > b.date ? -1 : a.date === b.date ? 0 : 1;
	});

	return fullGames;
}

// CONTROLLER

export async function handleCreateGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.body) throw new ValidationError("No request body recieved");

	const result = InsertGameSchema.safeParse(req.body);
	if (!result.success)
		throw new ValidationError("Fields were either incorrect or missing");

	try {
		await createGame(result.data);
		return res.status(201).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetGameById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		const game = await fetchGameById(id);
		if (game) {
			const gameObj = exportGameObject(game);
			return res.status(200).json(gameObj);
		}
		return res.status(404).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGames(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const games = await fetchAllGames();
		if (games) {
			const fullGames = await exportGameObjects(games);
			return res.status(200).json(fullGames);
		}
		return res.status(400).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGamesByCreatedBy(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name } = req.params;

	if (!name) throw new ValidationError("No user provided");

	try {
		const games = await fetchGamesByCreatedBy(name);

		if (games) {
			const fullGames = await exportGameObjects(games);
			return res.status(200).json(fullGames);
		}

		return res.status(400).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGamesByPlayer(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name } = req.params;

	try {
		const games = await fetchAllGamesByPlayer(name);
		if (games) {
			const fullGames = await exportGameObjects(games);
			return res.status(200).json(fullGames);
		}
		return res.status(400).end();
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameWinners(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const winners = await fetchAllGameWinners();
		const winnerJson = new Array<{ player: string; wins: number }>();

		for (const [player, wins] of winners) {
			winnerJson.push({ player: player, wins: wins });
		}

		return res.status(200).json(winnerJson);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameWinnerLeaderIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const leaders = await fetchAllGameWinnerLeaderIds();

		return res.status(200).json(leaders);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameWinnerCivilizationIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const civs = await fetchAllGameWinnerCivilizationIds();

		return res.status(200).json(civs);
	} catch (error) {
		next(error);
	}
}

export async function handleGetAllGameVictoryIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const victories = await fetchAllGameVictoryIds();
		return res.status(200).json(victories);
	} catch (error) {
		next(error);
	}
}

export async function handleSoftDeleteGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params;

	try {
		await softRemoveGameById(id);
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
}

export async function handleUpdateGame(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.params) throw new ValidationError("No request id recieved");
	if (!req.body) throw new ValidationError("No request body recieved");

	const { id } = req.params;

	const result = UpdateGameSchema.safeParse(req.body);
	if (!result.success)
		throw new ValidationError("Fields were either incorrect or missing");

	try {
		const update = await updateGame(id, result.data);
		return res.status(200).json(update);
	} catch (error) {
		next(error);
	}
}
