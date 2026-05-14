import { Request, Response } from "express";
import { fetchAllHydratedGamesByPlayer } from "../db/services/game.service.js";
import geminiClient from "./client.js";

function cleanGamesForLLM(
	games: Awaited<ReturnType<typeof fetchAllHydratedGamesByPlayer>>
) {
	const cleaned = games.map((game) => {
		return {
			name: game.name,
			date: game.date,
			map: game.map,
			victory: game.victory,
			notes: game.notes,

			winnerPlayer: game.winner_player,
			winnerLeader: game.winner_leader?.name ?? null,
			winnerCivilization: game.winner_civilization?.name ?? null,

			players: game.game_player.map((player) => ({
				name: player.name,
				leader: player.leader?.name,
				civilization: player.civilization?.name,
			})),
		};
	});

	return cleaned;
}

export async function generateProfileSummary(req: Request, res: Response) {
	const { player } = req.params;
	try {
		const games = await fetchAllHydratedGamesByPlayer(player);
		const cleaned = cleanGamesForLLM(games);

		const response = await geminiClient.models.generateContent({
			model: "gemini-3.1-flash-lite-preview",
			contents: `
				You are a game analyst writing a player profile from match history.

				Write a concise profile for a user profile page.

				OUTPUT FORMAT:
				- Exactly 2 lines
				- Line 1: a two-word persona sentence in Title Case with a period.
				- Title must describe in-game behavior or strategy, not personality
				- Must be based on gameplay actions like economy, aggression, timing, or win style
				- Avoid abstract adjectives (e.g. adaptive, resilient, strategic)


				- Line 2: a single natural paragraph (50–100 words)
				- Summarize general playstyle and strategic tendencies
				- Use GAME NOTES as the primary signal for interpreting behavior and decision-making
				- Provide an honest performance assessment (strong, average, or weak based on results)
				- Be direct but respectful when performance is inconsistent or poor

				RULES:
				- No markdown, bullets, labels, or formatting of any kind
				- Keep tone natural and readable, not like a statistical report
				
				PLAYER:
				${player}

				MATCH HISTORY:
				${JSON.stringify(cleaned, null, 2)}
			`,
			config: {},
		});

		return res.status(200).json({
			message: response.text
				?.replace(/["'`]/g, "")
				.replace(/\n/g, " ")
				.replace(/\s+/g, " ")
				.trim(),
		});
	} catch (error) {
		console.log(error);
		throw new Error("Unable to generate profile summary.");
	}
}
