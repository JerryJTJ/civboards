import { Request, Response } from "express";
import { fetchAllFinishedGamesByPlayer } from "../db/services/game.service.js";
import geminiClient from "./client.js";

export async function generateProfileSummary(req: Request, res: Response) {
	const { player } = req.params;
	try {
		const games = await fetchAllFinishedGamesByPlayer(player);

		const response = await geminiClient.models.generateContent({
			model: "gemini-3.1-flash-lite-preview",
			contents:
				"Summarize my game performance in 100 words max" +
				JSON.stringify(games),
			config: {},
		});
		return res.status(200).json({ message: response.text });
	} catch {
		throw new Error("Unable to generate profile summary.");
	}
}
